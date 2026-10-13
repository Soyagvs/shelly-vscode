# Shelly Language Support for VS Code

VS Code language support for `.shelly` scripts.

This repository is separate from the Shelly runtime so users can clone, test, install, and report editor-support issues independently.

## Features

- Registers the `shelly` language for `.shelly` files.
- Adds TextMate syntax highlighting for comments, strings, variables, constants, keywords, built-ins, numbers, operators, arrows, and list selectors.
- Adds bracket, comment, folding, auto-closing, surrounding-pair, and simple indentation configuration.

## Try it like a user

Clone this repository and open it in VS Code:

```sh
git clone https://github.com/Soyagvs/shelly-vscode.git
cd shelly-vscode
code .
```

Then press `F5` and choose the Extension Development Host.

In the new VS Code window, open any `.shelly` file. The file should be detected as Shelly and receive syntax highlighting.

## Local install

For a one-off local install, copy or symlink this folder into your VS Code extensions directory and reload VS Code.

To package it first, install `vsce` separately, then run from this directory:

```sh
vsce package
code --install-extension shelly-language-support-0.0.1.vsix
```

## Diagnostics roadmap

Syntax highlighting is the first step. Real error markers should come from a safe Shelly checker command, for example:

```sh
shelly check path/to/file.shelly
```

That command should parse and validate scripts without executing `command`, `shellout`, or any other side-effecting code. Once Shelly exposes that checker, this extension can call it and show diagnostics in VS Code.

## Related

- Shelly runtime: <https://github.com/Soyagvs/shelly>
