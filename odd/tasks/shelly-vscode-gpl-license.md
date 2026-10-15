# GPL licensing

Feature: relicense the Shelly VS Code extension under GNU GPL version 3 or later.

## Approved direction

Replace MIT with the unmodified GNU GPL v3 text and declare `GPL-3.0-or-later` in extension package metadata. The copyright owner confirmed authority over the current codebase.

## Tasks

- [x] Replace the extension license with the official GPL v3 text.
- [x] Declare the SPDX license identifier in `package.json`.
- [x] Verify license text integrity and package metadata.

## Constraints

- Use the official, unmodified GNU GPL v3 license text.
- Do not commit unless explicitly requested.

## Evidence

- Work-unit commit: `d0ab7f1 chore: relicense extension under GPL`.
- LICENSE matches the official GNU GPL v3 text (Version 3, 29 June 2007).
- Package metadata declares `GPL-3.0-or-later`.
- `git diff --check` passed.
