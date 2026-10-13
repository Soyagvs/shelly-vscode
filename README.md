# Shelly Language Support for VS Code

VS Code language support for `.shelly` scripts.

This repository is separate from the Shelly runtime so users can clone, test, install, and report editor-support issues independently.

## Features

- Registers the `shelly` language for `.shelly` files.
- Adds TextMate syntax highlighting for comments, strings, variables, constants, keywords, built-ins, numbers, operators, arrows, and list selectors.
- Adds bracket, comment, folding, auto-closing, surrounding-pair, and simple indentation configuration.

## Install from GitHub Releases

Download `shelly-language-support-0.0.1.vsix` from the latest release:

<https://github.com/Soyagvs/shelly-vscode/releases/latest>

Then install it with VS Code:

```sh
code --install-extension shelly-language-support-0.0.1.vsix
```

Reload VS Code and open a `.shelly` file. The language mode in the bottom-right corner should say `Shelly`.

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
