# Shelly VS Code 0.0.7 release

Feature: publish the LSP client changes as a new extension version rather than reusing Marketplace version 0.0.6.

## Decision

- Bump the extension package version to `0.0.7`.
- Generate and verify a distributable VSIX for the user to upload to Marketplace.
- Do not publish to Marketplace from this session.

## Evidence

- `npm ci`: passed from a clean dependency install; 123 packages audited, 0 vulnerabilities.
- `npm run build`: passed.
- `npm run validate`: passed.
- `npm test`: passed; 6 tests.
- `npm run package`: passed; 327 files packaged, including `src/client.js` and production `vscode-languageclient` runtime files.
- Development dependency `@vscode/vsce` excluded from the VSIX.
- `npm run verify-package`: passed; verified the client and required language-client protocol entrypoints.
- Package artifact: `/home/soyagvs/proyectos/personal/shelly-vscode/shelly-language-oficial-0.0.7.vsix`.
- Committed and pushed as `024f9a0` (`release: prepare VS Code extension 0.0.7`).
- GitHub tag and release [`v0.0.7`](https://github.com/Soyagvs/shelly-vscode/releases/tag/v0.0.7) created with the verified VSIX attached.
- Marketplace publication remains user-managed.

## Tasks

- [x] Update version references to 0.0.7.
- [x] Build and inspect the 0.0.7 VSIX.
- [x] Commit, tag, and create the GitHub release.
