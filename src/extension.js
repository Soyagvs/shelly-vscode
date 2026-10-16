const vscode = require('vscode');
const { createShellyClient } = require('./client');
// The managed client uses LanguageClient and TransportKind.stdio; lifecycle is client.start() / client.stop().
// File-backed selector contract: document.languageId === 'shelly' and document.uri.scheme === 'file'.

let client;

/** @param {vscode.ExtensionContext} context */
function activate(context) {
  client = createShellyClient(vscode);
  context.subscriptions.push(client);

  client.start().catch((error) => {
    const serverPath = vscode.workspace.getConfiguration('shelly').get('serverPath', 'shelly-lsp');
    const detail = error?.message ? ` ${error.message}` : '';
    vscode.window.showErrorMessage(
      `Shelly language server failed to start (${serverPath}). Install the server or set shelly.serverPath to its executable path.${detail}`
    );
  });
}

async function deactivate() {
  if (client) {
    await client.stop();
    client = undefined;
  }
}

module.exports = { activate, deactivate };
