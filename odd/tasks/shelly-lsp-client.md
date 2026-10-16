# Shelly LSP client integration

Feature: replace file-based checker diagnostics with the Shelly LSP v1 client.

## Decisions

- Use `shelly-lsp` over stdio as the editor integration protocol.
- Provide a configurable server path with `shelly-lsp` as the default.
- LSP owns diagnostics; do not run duplicate checker diagnostics.
- Startup failure must be visible and actionable.
- Preserve existing language/syntax support.

## Tasks

- [x] Add LSP client contract and RED lifecycle/configuration tests.
- [x] Replace checker runner with managed stdio language client.
- [x] Document server installation, configuration, and troubleshooting.
- [x] Package and verify the extension.

## Evidence

- `npm test`: 6 passed.
- `npm run build`, `npm run validate`, `npm run package`, and `git diff --check`: passed.
- Package artifact: `shelly-language-oficial-0.0.6.vsix`.
- No commit created; awaiting explicit user authorization.
