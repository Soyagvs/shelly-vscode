const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const extensionSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'extension.js'), 'utf8');
const grammar = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'syntaxes', 'shelly.tmLanguage.json'), 'utf8'));
const languageConfiguration = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'language-configuration.json'), 'utf8'));

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

test('includes shell, shellin, and text/date helpers in builtin grammar rules', () => {
  const builtins = grammar.repository?.builtins?.patterns ?? [];
  const builtinMatch = builtins.map((pattern) => pattern.match ?? '').join('|');
  for (const helper of ['shell', 'shellin', 'substring', 'padLeft', 'padRight', 'formatDate']) {
    assert.ok(builtinMatch.includes(helper), `missing builtin helper: ${helper}`);
  }
});

test('does not define legacy dollar-dollar constant highlighting', () => {
  const grammarText = JSON.stringify(grammar);
  assert.doesNotMatch(grammarText, /variable\.other\.constant\.shelly/);
  assert.doesNotMatch(grammarText, /\\\\\$\\\\\$/);
});

test('defines dedicated function-name and dictionary-key grammar patterns', () => {
  assert.ok(grammar.repository?.functionNames, 'missing function-name grammar scope');
  assert.ok(grammar.repository?.dictionaryKeys, 'missing dictionary-key grammar scope');
  assert.ok(grammar.patterns.some((pattern) => pattern.include === '#functionNames'));
  assert.ok(grammar.patterns.some((pattern) => pattern.include === '#dictionaryKeys'));
});

test('indents all block constructs in language configuration', () => {
  const increase = languageConfiguration.indentationRules?.increaseIndentPattern ?? '';
  for (const keyword of ['try', 'catch', 'case', 'when', 'log']) {
    assert.match(increase, new RegExp(`\\\\b${keyword}\\\\b`));
  }
});
