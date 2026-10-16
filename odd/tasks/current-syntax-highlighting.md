# Align VS Code highlighting with current Shelly syntax

Feature: update Shelly VS Code syntax highlighting and editor configuration for current language forms, then add structural coverage for the grammar and indentation rules.

## Decisions

- Add current `shell` and `shellin` built-ins to the TextMate grammar.
- Remove legacy `$$CONSTANT` highlighting because current Shelly parsing rejects that syntax.
- Improve semantic scopes for function names and dictionary keys where grammar structure permits.
- Expand indentation patterns for current block constructs.
- Add automated structural assertions for the changed grammar/configuration; a manual VS Code token-color check remains required for rendered theme colors.

## Tasks

- [x] Add failing tests for current syntax highlighting and indentation coverage.
- [x] Update grammar and language configuration.
- [x] Run focused and full extension verification.
- [x] Record manual VS Code validation requirements.
- [x] Commit the extension fix.

## Evidence

- RED observed: `npm test` ran 10 tests with 6 passing and 4 expected failures for missing `shell`/`shellin`, legacy constants, dedicated function/dictionary scopes, and block indentation.
- GREEN observed: grammar/configuration update made all 10 `npm test` tests pass.
- Independent verification passed: validate, build, tests, package, package verification, and diff check. Grammar confirms current builtins/scopes and indentation rules.
- Manual rendered-color validation remains user-facing: open a `.shelly` file in VS Code, run **Developer: Inspect Editor Tokens and Scopes**, and check `shell`, `shellin`, functions, dictionary keys, multiline strings, `try/catch`, `case/when`, and `log` under the intended color theme.
- Extension fix committed as `e1e53a1b6c190a0377abedf40051cdc61a5b361e` (`fix(grammar): cover current Shelly syntax`).
