const path = require('node:path');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');

const SHELLY_LANGUAGE_ID = 'shelly';

/**
 * Create the managed Shelly language client for file-backed Shelly documents.
 * @param {import('vscode')} vscode
 * @returns {import('vscode-languageclient/node').LanguageClient}
 */
function createShellyClient(vscode) {
  const serverPath = vscode.workspace.getConfiguration('shelly').get('serverPath', 'shelly-lsp');
  const serverOptions = {
    command: serverPath,
    args: [],
    options: { cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd() },
    transport: TransportKind.stdio,
  };

  return new LanguageClient(
    'shellyLanguageServer',
    'Shelly Language Server',
    serverOptions,
    {
      documentSelector: [{ language: SHELLY_LANGUAGE_ID, scheme: 'file' }],
      outputChannelName: 'Shelly Language Server',
    }
  );
}

module.exports = { createShellyClient };
