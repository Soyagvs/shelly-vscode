# Shelly VS Code 0.1.1 release

Feature: prepare the approved VS Code extension release metadata and user-facing documentation for `v0.1.1`.

## Decisions

- Bump the extension and lockfile version to `0.1.1`.
- Update README installation and release references to `0.1.1`.
- Document the release highlights in `CHANGELOG.md`.
- Preserve the existing grammar and test changes in the working tree.
- Build and verify the VSIX, then commit, tag, push, and publish the approved release from `main`.

## Tasks

- [x] Update package and lockfile release metadata.
- [x] Update user-facing release and installation references.
- [x] Add the `0.1.1` changelog entry.
- [x] Build and verify the VSIX in the release transaction.
- [x] Commit, tag, push, and publish GitHub release `v0.1.1`.

## Evidence

- Committed on `main`: `ed8ba88` (`feat(syntax): support regex predicates`).
- Verified VSIX: `shelly-language-oficial-0.1.1.vsix`, SHA-256 `0549e3bc46c3327be0ac64ce806325101cc9c83dbac23f8169c262038d3c4b69`.
- Published release: https://github.com/Soyagvs/shelly-vscode/releases/tag/v0.1.1
