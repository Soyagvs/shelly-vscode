const path = require('node:path');

const SHELLY_LANGUAGE_ID = 'shelly';

/**
 * Select the folder represented by the active document. A single-folder
 * workspace remains supported when no editor is active; multi-root workspaces
 * are intentionally not guessed at by choosing their first folder.
 * @param {import('vscode')} vscode
 * @returns {import('vscode').WorkspaceFolder|undefined}
 */
function getShellyWorkspaceFolder(vscode) {
  const document = vscode.window.activeTextEditor?.document;
  if (document) {
    return vscode.workspace.getWorkspaceFolder(document.uri);
  }

  const folders = vscode.workspace.workspaceFolders ?? [];
  return folders.length === 1 ? folders[0] : undefined;
}

/**
 * @param {import('vscode')} vscode
 * @returns {{ workspaceFolder?: import('vscode').WorkspaceFolder, cwd: string }}
 */
function getShellyWorkspaceContext(vscode) {
  const workspaceFolder = getShellyWorkspaceFolder(vscode);
  return {
    workspaceFolder,
    cwd: workspaceFolder?.uri.fsPath || process.cwd(),
  };
}

/**
 * Create the managed Shelly language client for file-backed Shelly documents.
 * @param {import('vscode')} vscode
 * @returns {import('vscode-languageclient/node').LanguageClient}
 */
function createShellyClient(vscode) {
  const { LanguageClient, TransportKind } = require('vscode-languageclient/node');
  const serverPath = vscode.workspace.getConfiguration('shelly').get('serverPath', 'shelly-lsp');
  const { workspaceFolder, cwd } = getShellyWorkspaceContext(vscode);
  const serverOptions = {
    command: serverPath,
    args: [],
    options: { cwd },
    transport: TransportKind.stdio,
  };

  return new LanguageClient(
    'shellyLanguageServer',
    'Shelly Language Server',
    serverOptions,
    {
      documentSelector: [{ language: SHELLY_LANGUAGE_ID, scheme: 'file' }],
      ...(workspaceFolder ? { workspaceFolder } : {}),
      outputChannelName: 'Shelly Language Server',
    }
  );
}

module.exports = { createShellyClient, getShellyWorkspaceFolder, getShellyWorkspaceContext };
