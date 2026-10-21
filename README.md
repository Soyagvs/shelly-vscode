<img width="2056" height="765" alt="Shelly_ Extensión VS Code y Cuervo" src="https://github.com/user-attachments/assets/1d2b8056-d182-42e6-afba-574a78421053" />

[![Release](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Soyagvs/shelly-vscode/main/.github/badges/release.json&style=flat-square)](https://github.com/Soyagvs/shelly-vscode/releases) [![Downloads](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Soyagvs/shelly-vscode/main/.github/badges/downloads.json&style=flat-square)](https://github.com/Soyagvs/shelly-vscode/releases)

# Shelly Language Oficial for VS Code

VS Code language support for `.shelly` scripts.

This repository is separate from the Shelly runtime so users can clone, test, install, and report editor-support issues independently.

## Features

- Registers the `shelly` language for `.shelly` files.
- Adds TextMate syntax highlighting for comments, one-line and multiline strings, variables, constants, keywords, built-ins, HTTP v1 commands and options, numbers, operators, arrows, dictionaries, nested access, and list selectors.
- Adds bracket, comment, folding, auto-closing, surrounding-pair, and simple indentation configuration.
- Connects `.shelly` files to the Shelly LSP v1 language server for editor language features and diagnostics.


## File icons

This extension ships a `Shelly Icons` file icon theme that maps `.shelly` files to the Shelly logo. Select it with **Preferences: File Icon Theme** if VS Code does not enable it automatically.

## Shelly v3.1 syntax coverage

Highlighting includes current Shelly syntax such as `arg`, `hasArg`, `args`, `case` / `when`, `try` / `catch`, `log`, `watch <program> <args...> -> $line ... end`, bare `wait`, HTTP v1 `http` requests with `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`, plus `headers`, `body`, `timeout`, and `maxBytes` options, text and date helpers, file helpers, JSON helpers, dictionaries, nested list/dictionary access, and triple-backtick multiline strings.

## Latest release

Current version: **v0.1.2**

Download `shelly-language-oficial-0.1.2.vsix` from the latest release:

<https://github.com/Soyagvs/shelly-vscode/releases/latest>

Then install it with VS Code:

```sh
code --install-extension shelly-language-oficial-0.1.2.vsix
```

Reload VS Code and open a `.shelly` file. The language mode in the bottom-right corner should say `Shelly`.

## Shelly LSP integration

The extension starts the `shelly-lsp` server for file-backed `.shelly` documents and communicates with it over standard input/output. The client uses the active document's workspace folder (or the sole folder in an ordinary single-folder workspace) for the server working directory and standard LSP workspace-root data. With no applicable folder it starts without a root and uses the extension host's working directory. Multi-root folder selection is intentionally not inferred. The verified shared capabilities are: diagnostics, completion, hover, definition, references, document symbols, workspace symbols, and conservative rename. Validation for recursive Shelly `**` file globs is provided by the server; the extension does not expand globs itself or execute Shelly scripts.

Install the `shelly-lsp` executable separately and make sure it is available on your `PATH`. The extension uses `shelly-lsp` by default. To use a different executable or an absolute path, set `shelly.serverPath` in VS Code settings, for example:

```json
{
  "shelly.serverPath": "/path/to/shelly-lsp"
}
```

There is currently no formatting support. Use another formatter if you need formatted Shelly source.

Language helper semantics and date formats are documented in the [canonical Shelly helper docs](https://github.com/Soyagvs/shelly/blob/main/docs/helpers.md) and [date-formatting docs](https://github.com/Soyagvs/shelly/blob/main/docs/date-formatting.md).

### Startup troubleshooting

- Run `shelly-lsp` from a terminal to verify that it is installed and executable.
- Check that VS Code was started with the same `PATH` that contains `shelly-lsp`; GUI-launched VS Code may not inherit your shell setup.
- Set `shelly.serverPath` to the full executable path when the command is not on `PATH`.
- Check **View > Output** and select **Shelly Language Server** for startup and protocol logs.
- If the server cannot start, the extension shows an actionable error; fixing the path or installation and reloading the window should restart it.

## Try it in development mode

Clone this repository and open it in VS Code:

```sh
git clone https://github.com/Soyagvs/shelly-vscode.git
cd shelly-vscode
code .
```

Open the Run and Debug panel, choose `Run Shelly Extension`, and start it. In the new VS Code window, open any `.shelly` file.

## Package locally

Install dependencies and build the `.vsix` package (including production runtime dependencies):

```sh
npm ci
npm run package
npm run verify-package
code --install-extension shelly-language-oficial-0.1.2.vsix
```

`npm run verify-package` inspects the resulting VSIX and fails unless the extension client and `vscode-languageclient` runtime entrypoint are present.

## Related

- Shelly runtime: <https://github.com/Soyagvs/shelly>
- Shelly Neovim integration: <https://github.com/Soyagvs/shelly-nvim>

## License

Licensed under the GNU General Public License v3.0 or later. See [LICENSE](LICENSE).
