const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const extensionSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'extension.js'), 'utf8');
const grammar = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'syntaxes', 'shelly.tmLanguage.json'), 'utf8'));
const languageConfiguration = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'language-configuration.json'), 'utf8'));
const { getShellyWorkspaceContext } = require('../src/client');

test('declares shelly-lsp as the default server path and exposes shelly.serverPath', () => {
  const properties = packageJson.contributes?.configuration?.properties;
  assert.equal(properties?.['shelly.serverPath']?.default, 'shelly-lsp');
});

test('uses the configured shelly.serverPath when constructing the language server', () => {
  assert.match(extensionSource, /shelly\.serverPath/);
  assert.match(extensionSource, /getConfiguration\(['"]shelly['"]\)/);
  assert.match(extensionSource, /serverPath/);
});

test('selects the active document folder and propagates its root context', () => {
  const folder = { uri: { fsPath: '/workspace/app' } };
  const vscode = {
    window: { activeTextEditor: { document: { uri: { toString: () => 'file:///workspace/app/main.shelly' } } } },
    workspace: {
      workspaceFolders: [folder, { uri: { fsPath: '/workspace/other' } }],
      getWorkspaceFolder(uri) {
        assert.ok(uri);
        return folder;
      },
    },
  };
  assert.deepEqual(getShellyWorkspaceContext(vscode), { workspaceFolder: folder, cwd: '/workspace/app' });
});

test('uses the sole folder without an active editor and has safe no-workspace behavior', () => {
  const folder = { uri: { fsPath: '/workspace/only' } };
  const single = { window: {}, workspace: { workspaceFolders: [folder], getWorkspaceFolder() {} } };
  assert.deepEqual(getShellyWorkspaceContext(single), { workspaceFolder: folder, cwd: '/workspace/only' });

  const none = { window: {}, workspace: { workspaceFolders: [], getWorkspaceFolder() {} } };
  const context = getShellyWorkspaceContext(none);
  assert.equal(context.workspaceFolder, undefined);
  assert.equal(context.cwd, process.cwd());
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

test('highlights matches as a builtin predicate', () => {
  const builtinMatch = (grammar.repository?.builtins?.patterns ?? []).map((pattern) => pattern.match ?? '').join('|');
  assert.match(builtinMatch, /matches/);
});

test('defines regex literals before generic operators and rejects unterminated literals', () => {
  const regexIndex = grammar.patterns.findIndex((pattern) => pattern.include === '#regexLiterals');
  const operatorIndex = grammar.patterns.findIndex((pattern) => pattern.include === '#operators');
  assert.ok(regexIndex >= 0, 'missing regex literal include');
  assert.ok(regexIndex < operatorIndex, 'regex literals must precede operators');

  const regexRule = grammar.repository?.regexLiterals?.patterns?.[0];
  assert.ok(regexRule?.match, 'missing regex literal match rule');
  const literal = new RegExp(`^(?:${regexRule.match})$`);
  for (const value of ['/^[a-z]+\\d+$/', '/path\\/segment/']) {
    assert.match(value, literal);
  }
  assert.doesNotMatch('/path/segment', literal);
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
  for (const keyword of ['try', 'catch', 'case', 'when', 'log', 'watch']) {
    assert.match(increase, new RegExp(`\\\\b${keyword}\\\\b`));
  }
});

test('highlights watch as a builtin command', () => {
  const builtinMatch = (grammar.repository?.builtins?.patterns ?? []).map((pattern) => pattern.match ?? '').join('|');
  assert.match(builtinMatch, /watch/);
});

test('highlights wait as a builtin command', () => {
  const builtinMatch = (grammar.repository?.builtins?.patterns ?? []).map((pattern) => pattern.match ?? '').join('|');
  assert.match(builtinMatch, /wait/);
});

test('defines archive v1 commands and options without matching variables or unrelated commands', () => {
  const archiveRules = grammar.repository?.archive?.patterns ?? [];
  assert.equal(archiveRules.length, 1);
  const archiveRule = archiveRules[0];
  assert.equal(archiveRule.name, 'support.function.archive.shelly');
  assert.match(archiveRule.begin, /archive/);
  const subcommandRule = archiveRule.patterns.find((pattern) => pattern.name === 'support.function.archive.subcommand.shelly');
  const optionRule = archiveRule.patterns.find((pattern) => pattern.name === 'support.type.property-name.archive.shelly');
  assert.ok(subcommandRule?.match, 'missing archive subcommand rule');
  assert.ok(optionRule?.match, 'missing archive option rule');
  const subcommand = new RegExp(`^(?:${subcommandRule.match})$`);
  for (const value of ['create', 'extract', 'checksum', 'check']) assert.match(value, subcommand);
  assert.doesNotMatch('archive', subcommand);
  assert.doesNotMatch('$create', subcommand);
  const option = new RegExp(`^(?:${optionRule.match})$`);
  for (const value of ['from', 'into']) assert.match(value, option);
  assert.doesNotMatch('$from', option);
  const archiveIndex = grammar.patterns.findIndex((pattern) => pattern.include === '#archive');
  assert.ok(archiveIndex > grammar.patterns.findIndex((pattern) => pattern.include === '#strings'));
  assert.ok(archiveIndex < grammar.patterns.findIndex((pattern) => pattern.include === '#variables'));
});

test('defines mock and secret commands with target subcommands without matching strings, variables, or comments', () => {
  const mockRules = grammar.repository?.mock?.patterns ?? [];
  assert.equal(mockRules.length, 1);
  const mockRule = mockRules[0];
  assert.equal(mockRule.name, 'support.function.mock.shelly');
  assert.match(mockRule.begin, /mock/);
  assert.match(mockRule.begin, /secret/);
  const subcommandRule = mockRule.patterns.find((pattern) => pattern.name === 'support.function.mock.subcommand.shelly');
  const returnsRule = mockRule.patterns.find((pattern) => pattern.name === 'keyword.control.mock.returns.shelly');
  assert.ok(subcommandRule?.match, 'missing mock target subcommand rule');
  assert.ok(returnsRule?.match, 'missing mock returns rule');
  const subcommands = new RegExp(`^(?:${subcommandRule.match})$`);
  for (const value of ['get', 'set', 'call', 'event', 'notify']) assert.match(value, subcommands);
  for (const value of ['mock', 'secret', '$get', '"get"', '# get #']) assert.doesNotMatch(value, subcommands);
  const returns = new RegExp(`^(?:${returnsRule.match})$`);
  assert.match('returns', returns);
  assert.doesNotMatch('$returns', returns);
  assert.ok(grammar.patterns.some((pattern) => pattern.include === '#mock'));
  assert.ok(grammar.patterns.findIndex((pattern) => pattern.include === '#mock') > grammar.patterns.findIndex((pattern) => pattern.include === '#strings'));
  assert.ok(grammar.patterns.findIndex((pattern) => pattern.include === '#mock') < grammar.patterns.findIndex((pattern) => pattern.include === '#variables'));
});

test('defines HTTP v1 commands, methods, and options without matching variables', () => {
  const httpRules = grammar.repository?.http?.patterns ?? [];
  assert.equal(httpRules.length, 2);
  const commandRule = httpRules.find((pattern) => pattern.name === 'support.function.http.shelly');
  const optionRule = httpRules.find((pattern) => pattern.name === 'support.type.property-name.http.shelly');
  assert.ok(commandRule?.match, 'missing HTTP command rule');
  assert.ok(optionRule?.match, 'missing HTTP option rule');
  const command = new RegExp(`^(?:${commandRule.match})$`);
  for (const value of ['http', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']) {
    assert.match(value, command);
  }
  assert.doesNotMatch('$http', command);
  const option = new RegExp(optionRule.match);
  for (const value of ['headers:', 'body:', 'timeout:', 'maxBytes:']) {
    assert.match(value, option);
  }
  const httpIndex = grammar.patterns.findIndex((pattern) => pattern.include === '#http');
  assert.ok(httpIndex > grammar.patterns.findIndex((pattern) => pattern.include === '#strings'));
  assert.ok(httpIndex < grammar.patterns.findIndex((pattern) => pattern.include === '#variables'));
});
