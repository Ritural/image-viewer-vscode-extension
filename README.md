# Image Viewer - VSCode Extension

This VSCode extension is designed to help with viewing and using images in code.

## TODO
- `[ ]` Index image files (.png, .svg, .jpg, etc)
- `[ ]` On command "Image insert" list out all the images
- `[ ]` Display image preview in the list?

### Extras
- `[ ]` Display image preview using decorations
- `[ ]` Filterable images
 
## Demo

![demo](demo.gif)

## VS Code API

### `vscode` module


- [`commands.registerCommand`](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand)
- [`window.showInformationMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)

# Development

## Running the extension

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window
