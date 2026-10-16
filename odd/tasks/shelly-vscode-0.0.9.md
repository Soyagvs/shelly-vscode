# Shelly VS Code 0.0.9 release

Feature: publish the verified current-syntax highlighting update as a new VS Code extension release.

## Decisions

- Bump the extension to `0.0.9`.
- Build and verify a new VSIX containing the updated grammar and indentation behavior.
- Publish the VSIX in GitHub Release `v0.0.9`.
- Marketplace publication remains separate unless explicitly configured.

## Tasks

- [x] Update release version references.
- [x] Build and verify `shelly-language-oficial-0.0.9.vsix`.
- [ ] Commit, tag, push, and publish GitHub Release `v0.0.9`.

## Evidence

- Updated `package.json`, `package-lock.json`, and README release/install references to `0.0.9`.
- Independent verification passed: validate, build, tests (10/10), packaging, archive verification, and diff check.
- Package artifact: `shelly-language-oficial-0.0.9.vsix` (829.53 KB, 327 files), containing the grammar and language configuration.
