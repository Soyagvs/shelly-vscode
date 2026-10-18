# Shelly VS Code 0.1.1 release

Feature: prepare the approved VS Code extension release metadata and user-facing documentation for `v0.1.1`.

## Decisions

- Bump the extension and lockfile version to `0.1.1`.
- Update README installation and release references to `0.1.1`.
- Document the release highlights in `CHANGELOG.md`.
- Preserve the existing grammar and test changes in the working tree.
- Do not build the VSIX or commit, tag, push, or publish from this preparation.

## Tasks

- [x] Update package and lockfile release metadata.
- [x] Update user-facing release and installation references.
- [x] Add the `0.1.1` changelog entry.
- [ ] Build and verify the VSIX in the release transaction.
- [ ] Commit, tag, push, and publish GitHub release `v0.1.1`.
