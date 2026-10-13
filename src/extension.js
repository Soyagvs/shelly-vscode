const vscode = require('vscode');
const { execFile } = require('child_process');

const SHELLY_LANGUAGE_ID = 'shelly';
const CHECK_DEBOUNCE_MS = 500;

/** @type {vscode.DiagnosticCollection | undefined} */
let diagnosticCollection;
/** @type {Map<string, NodeJS.Timeout>} */
const pendingChecks = new Map();
let warnedAboutChecker = false;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('shelly');
  context.subscriptions.push(diagnosticCollection);

  vscode.workspace.textDocuments.forEach((document) => {
    if (isShellyDocument(document)) {
      scheduleCheck(document, 0);
    }
  });

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      if (isShellyDocument(document)) {
        scheduleCheck(document, 0);
      }
    }),
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (isShellyDocument(document)) {
        scheduleCheck(document, 0);
      }
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (isShellyDocument(event.document)) {
        scheduleCheck(event.document, CHECK_DEBOUNCE_MS);
      }
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      clearPendingCheck(document.uri);
      diagnosticCollection?.delete(document.uri);
    })
  );
}

function deactivate() {
  pendingChecks.forEach((timeout) => clearTimeout(timeout));
  pendingChecks.clear();
  diagnosticCollection?.dispose();
}

/**
 * @param {vscode.TextDocument} document
 */
function isShellyDocument(document) {
  return document.languageId === SHELLY_LANGUAGE_ID && document.uri.scheme === 'file';
}

/**
 * @param {vscode.TextDocument} document
 * @param {number} delayMs
 */
function scheduleCheck(document, delayMs) {
  clearPendingCheck(document.uri);

  const timeout = setTimeout(() => {
    pendingChecks.delete(document.uri.toString());
    runShellyCheck(document);
  }, delayMs);

  pendingChecks.set(document.uri.toString(), timeout);
}

/**
 * @param {vscode.Uri} uri
 */
function clearPendingCheck(uri) {
  const key = uri.toString();
  const existing = pendingChecks.get(key);
  if (existing) {
    clearTimeout(existing);
    pendingChecks.delete(key);
  }
}

/**
 * @param {vscode.TextDocument} document
 */
function runShellyCheck(document) {
  execFile('shelly', ['check', '--format', 'json', document.uri.fsPath], { windowsHide: true }, (error, stdout, stderr) => {
    if (!diagnosticCollection) {
      return;
    }

    const parsed = parseCheckerOutput(stdout);
    if (parsed) {
      diagnosticCollection.set(document.uri, parsed.map((item) => toDiagnostic(document, item)));
      return;
    }

    if (error) {
      const message = error.code === 'ENOENT'
        ? 'Shelly diagnostics require the Shelly runtime with `shelly check` on PATH.'
        : `Shelly checker failed without JSON diagnostics.${stderr ? ` ${stderr.trim()}` : ''}`;

      diagnosticCollection.set(document.uri, [createDocumentDiagnostic(document, message)]);
      showCheckerWarning(message);
      return;
    }

    diagnosticCollection.delete(document.uri);
  });
}

/**
 * @param {string} stdout
 * @returns {Array<{file?: string,line?: number,column?: number,severity?: string,message?: string}> | undefined}
 */
function parseCheckerOutput(stdout) {
  const text = stdout.trim();
  if (!text) {
    return [];
  }

  try {
    const value = JSON.parse(text);
    if (Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(value.diagnostics)) {
      return value.diagnostics;
    }
  } catch (_error) {
    return undefined;
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} document
 * @param {{line?: number,column?: number,severity?: string,message?: string}} item
 */
function toDiagnostic(document, item) {
  const line = Math.max(0, (Number(item.line) || 1) - 1);
  const column = Math.max(0, (Number(item.column) || 1) - 1);
  const position = document.validatePosition(new vscode.Position(line, column));
  const wordRange = document.getWordRangeAtPosition(position);
  const range = wordRange || new vscode.Range(position, position.translate(0, 1));
  const diagnostic = new vscode.Diagnostic(range, item.message || 'Shelly diagnostic', toSeverity(item.severity));
  diagnostic.source = 'shelly';
  return diagnostic;
}

/**
 * @param {string | undefined} severity
 */
function toSeverity(severity) {
  switch ((severity || '').toLowerCase()) {
    case 'error':
      return vscode.DiagnosticSeverity.Error;
    case 'warning':
    case 'warn':
      return vscode.DiagnosticSeverity.Warning;
    case 'information':
    case 'info':
      return vscode.DiagnosticSeverity.Information;
    case 'hint':
      return vscode.DiagnosticSeverity.Hint;
    default:
      return vscode.DiagnosticSeverity.Error;
  }
}

/**
 * @param {vscode.TextDocument} document
 * @param {string} message
 */
function createDocumentDiagnostic(document, message) {
  const position = document.validatePosition(new vscode.Position(0, 0));
  const diagnostic = new vscode.Diagnostic(new vscode.Range(position, position), message, vscode.DiagnosticSeverity.Warning);
  diagnostic.source = 'shelly';
  return diagnostic;
}

/**
 * @param {string} message
 */
function showCheckerWarning(message) {
  if (!warnedAboutChecker) {
    warnedAboutChecker = true;
    vscode.window.showWarningMessage(message);
  }
}

module.exports = {
  activate,
  deactivate,
  parseCheckerOutput,
};
