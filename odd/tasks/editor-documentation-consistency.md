# Editor documentation consistency

## Scope

Keep the VS Code documentation aligned with the shared `shelly-lsp` integration and provide navigation between the editor integrations without changing runtime, source, tests, generated files, or release claims.

## Verified VS Code updates

- Document shared `shelly-lsp` capabilities: diagnostics, completion, hover, definition, references, document symbols, workspace symbols, and conservative rename.
- State that recursive Shelly `**` file-glob validation is provided by the server and is not expanded by the extension.
- Link the Shelly Neovim integration alongside the Shelly runtime in **Related**.
- Retain the existing Shelly v3.1 TextMate grammar-support claim; do not claim v3.5 grammar coverage.

## Files

- `README.md`
- `odd/tasks/editor-documentation-consistency.md`
