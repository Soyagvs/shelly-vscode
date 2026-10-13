# Shelly Language Support for VS Code

VS Code language support for `.shelly` scripts.

This repository is separate from the Shelly runtime so users can clone, test, install, and report editor-support issues independently.

## Features

- Registers the `shelly` language for `.shelly` files.
- Adds TextMate syntax highlighting for comments, one-line and multiline strings, variables, constants, keywords, built-ins, numbers, operators, arrows, dictionaries, nested access, and list selectors.
- Adds bracket, comment, folding, auto-closing, surrounding-pair, and simple indentation configuration.
- Shows diagnostics from `shelly check --format json` when a compatible Shelly runtime is installed.


## File icons

This extension ships a `Shelly Icons` file icon theme that maps `.shelly` files to the Shelly logo. Select it with **Preferences: File Icon Theme** if VS Code does not enable it automatically.

## Shelly v3.1 syntax coverage

Highlighting includes current Shelly syntax such as `arg`, `hasArg`, `args`, `case` / `when`, `try` / `catch`, `log`, file helpers, JSON helpers, dictionaries, nested list/dictionary access, and triple-backtick multiline strings.

## Install from GitHub Releases

Download `shelly-language-support-0.0.4.vsix` from the latest release:

<https://github.com/Soyagvs/shelly-vscode/releases/latest>

Then install it with VS Code:

```sh
code --install-extension shelly-language-support-0.0.4.vsix
```

Reload VS Code and open a `.shelly` file. The language mode in the bottom-right corner should say `Shelly`.

Diagnostics require a Shelly runtime version that provides `shelly check --format json <file>` on your `PATH`. If the command is missing or fails without JSON output, the extension reports a single warning diagnostic instead of crashing.

## Try it in development mode

Clone this repository and open it in VS Code:

```sh
git clone https://github.com/Soyagvs/shelly-vscode.git
cd shelly-vscode
code .
```

Open the Run and Debug panel, choose `Run Shelly Extension`, and start it. In the new VS Code window, open any `.shelly` file.

## Package locally

Install dependencies and build the `.vsix` package:

```sh
npm install
npm run package
code --install-extension shelly-language-support-0.0.4.vsix
```

## Diagnostics

When a `.shelly` file is opened, saved, or edited, the extension runs:

```sh
shelly check --format json path/to/file.shelly
```

The checker must return JSON diagnostics with `file`, `line`, `column`, `severity`, and `message` fields. Change-triggered checks are debounced so the checker is not launched immediately on every keystroke.

## Related

- Shelly runtime: <https://github.com/Soyagvs/shelly>
