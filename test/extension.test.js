const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const extensionSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'extension.js'), 'utf8');

test('declares shelly-lsp as the default server path and exposes shelly.serverPath', () => {
  const properties = packageJson.contributes?.configuration?.properties;
  assert.equal(properties?.['shelly.serverPath']?.default, 'shelly-lsp');
});

test('uses the configured shelly.serverPath when constructing the language server', () => {
  assert.match(extensionSource, /shelly\.serverPath/);
  assert.match(extensionSource, /getConfiguration\(['"]shelly['"]\)/);
  assert.match(extensionSource, /serverPath/);
});

test('selects only file-backed Shelly documents for the language client', () => {
  assert.match(extensionSource, /languageId\s*===\s*['"]shelly['"]/);
  assert.match(extensionSource, /uri\.scheme\s*===\s*['"]file['"]/);
});

test('starts and stops a managed stdio Shelly language client', () => {
  assert.match(extensionSource, /LanguageClient/);
  assert.match(extensionSource, /TransportKind\.stdio/);
  assert.match(extensionSource, /client\.start\(\)/);
  assert.match(extensionSource, /client\.stop\(\)/);
});

test('does not run the legacy checker or create duplicate diagnostics', () => {
  assert.doesNotMatch(extensionSource, /execFile\(/);
  assert.doesNotMatch(extensionSource, /shelly['"],\s*\[['"]check/);
  assert.doesNotMatch(extensionSource, /createDiagnosticCollection\(/);
});

test('surfaces language-server startup failures with an actionable message', () => {
  assert.match(extensionSource, /show(Error|Warning)Message\(/);
  assert.match(extensionSource, /shelly-lsp/);
  assert.match(extensionSource, /serverPath|language server/i);
});
