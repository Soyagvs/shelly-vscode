# Contributing to Shelly VS Code

Thanks for helping improve the Shelly language extension. This repository provides VS Code language support for `.shelly` files; the Shelly runtime and language server live in separate repositories.

## Quick path

```sh
git clone https://github.com/Soyagvs/shelly-vscode.git
cd shelly-vscode
npm ci
npm run validate
npm run build
npm test
```

Then launch the extension with the **Run Shelly Extension** configuration and complete the [manual checklist](#extension-development-host-checklist).

## Scope

Contributions are welcome for:

- Shelly syntax highlighting and language configuration.
- VS Code extension activation and Shelly LSP integration.
- Extension tests and contributor documentation.

Keep Shelly runtime behavior and language-server implementation changes in the [Shelly runtime repository](https://github.com/Soyagvs/shelly). This extension starts `shelly-lsp`; it does not execute Shelly scripts.

## Prerequisites

- Node.js and npm.
- VS Code `1.85.0` or newer, matching the range declared in `package.json`.
- A working `shelly-lsp` executable from the Shelly LSP project, available on `PATH`, or an explicit path configured as `shelly.serverPath`.
- Git, if cloning the repository from GitHub.

Check the LSP before testing the extension:

```sh
shelly-lsp
```

The server may wait for protocol input; the important check is that the executable is installed and runnable. If it is not on `PATH`, set `shelly.serverPath` in VS Code settings to its executable path.

## Setup

1. Clone the repository and open it in VS Code:

   ```sh
   git clone https://github.com/Soyagvs/shelly-vscode.git
   cd shelly-vscode
   code .
   ```

2. Install the lockfile-defined dependencies:

   ```sh
   npm ci
   ```

3. If VS Code does not inherit the shell `PATH`, configure `shelly.serverPath` with the full path to `shelly-lsp`.

## Verified npm validation commands

Run the focused checks after changes:

| Command | Checks |
| --- | --- |
| `npm run validate` | Parses `package.json` and the TextMate grammar JSON. |
| `npm run build` | Syntax-checks `src/extension.js`. |
| `npm test` | Runs the Node test suite in `test/`. |

The package also exposes `npm run compile`, which delegates to `npm run build`.

## Extension Development Host checklist

1. Open **Run and Debug** in VS Code.
2. Select **Run Shelly Extension** and start debugging.
3. In the new Extension Development Host window, open a `.shelly` file.
4. Confirm the language mode in the status bar is **Shelly**.
5. Confirm syntax highlighting and Shelly file icons behave as expected.
6. Confirm the Shelly language server starts. For diagnostics or startup problems, open **View > Output** and select **Shelly Language Server**.
7. If the server cannot start, verify `shelly-lsp` or `shelly.serverPath`, then reload the window.

## Package and verify a VSIX

Build and inspect the local package with the repository scripts:

```sh
npm run package
npm run verify-package
```

`npm run package` creates `shelly-language-oficial-0.2.0.vsix`. The verification script checks that the VSIX contains the extension client and required `vscode-languageclient` and protocol runtime files. Install it locally only when needed for an install test:

```sh
code --install-extension shelly-language-oficial-0.2.0.vsix
```

Do not commit generated VSIX files.

## Cross-repository compatibility

The extension and Shelly LSP are versioned separately. When changing the client/server contract, test against the intended Shelly LSP version and describe that version in the PR. Keep shared language semantics aligned with the canonical [Shelly helper documentation](https://github.com/Soyagvs/shelly/blob/main/docs/helpers.md) and [date-formatting documentation](https://github.com/Soyagvs/shelly/blob/main/docs/date-formatting.md).

## Issue and pull request checklist

Before opening an issue or PR:

- [ ] Search existing issues and explain the smallest reproducible case.
- [ ] State whether the problem is in the extension, Shelly LSP, or Shelly runtime.
- [ ] Include the OS, VS Code version, Node/npm versions, and Shelly LSP version when relevant.
- [ ] Describe the `.shelly` input, expected behavior, and actual behavior.
- [ ] Run `npm run validate`, `npm run build`, and `npm test`.
- [ ] Complete the Extension Development Host checklist for behavior changes.
- [ ] Update documentation or tests when the user-visible contract changes.
- [ ] Keep generated artifacts and unrelated changes out of the PR.

## Maintainer-only release boundary

Contributors may build and verify local VSIX files. Publishing, release creation, version changes, and repository tags are maintainer-only operations. Do not publish or release from a contributor checkout; coordinate with maintainers through the project repository.

## License

Contributions are provided under the [GNU General Public License v3.0 or later](LICENSE), consistent with this extension's `GPL-3.0-or-later` license.
