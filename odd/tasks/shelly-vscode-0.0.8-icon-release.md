# Shelly VS Code 0.0.8 icon release

Feature: ship the user-provided extension image as the packaged VS Code Marketplace icon and publish GitHub release `v0.0.8`.

## Decision

- Use the supplied 512×512 RGBA PNG as `icons/shelly.png`, the path already declared by `package.json`.
- Remove the root staging copy after the packaged icon is verified.
- Preserve `icons/shelly.svg`, which belongs to the separate Shelly file-icon theme.
- Bump package and user-facing documentation references from `0.0.7` to `0.0.8`.
- Build, validate, test, package, and verify the VSIX before committing, tagging, pushing, and publishing the GitHub release.
- Marketplace publication remains user-managed.

## Tasks

- [x] Update release metadata and retain only the packaged extension icon.
- [x] Build and verify `shelly-language-oficial-0.0.8.vsix`.
- [x] Commit, tag, push, and publish GitHub release `v0.0.8` with the VSIX attachment.

## Evidence

- `package.json`, `package-lock.json`, and `README.md` reference `0.0.8` consistently; JSON parsing passed.
- `icons/shelly.png` contains the supplied 512×512 RGBA image.
- Removed the root staging image and its Windows `Zone.Identifier` companion; `icons/shelly.svg` remains for the file-icon theme.
- Independent verification passed: `npm run validate`, `npm run build`, `npm test` (6/6), `npm run package`, `npm run verify-package`, and `git diff --check`.
- Package artifact: `shelly-language-oficial-0.0.8.vsix` (829.24 KB, 327 files), containing `extension/icons/shelly.png`.
- Release preparation committed as `b86173dcffdb9c19ab85326a6a18f5a822b835b6` (`chore(release): prepare VS Code extension 0.0.8`).
- At publication, `main` and `origin/main` resolved to `7db08dda7ccc8f157f8098a3703f5ecadba5d3f2`; tag `v0.0.8` peels to that release commit.
- Published GitHub release: <https://github.com/Soyagvs/shelly-vscode/releases/tag/v0.0.8>, with `shelly-language-oficial-0.0.8.vsix` attached.
- Native review preflight could not run because the package-local Gentle AI binary is unavailable.
