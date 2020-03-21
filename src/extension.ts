// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getFiles } from './getFiles';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('🧐🧐🧐 <image-viewer-vscode-extension> is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.viewProjectImages', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Loading images...');

    const workspaceFolders =  vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      // No project open
      vscode.window.showInformationMessage('No project open!');
      return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    console.log('🧐🧐🧐 rootPath', rootPath);

    const foldersToCheck = ['src', 'public'];
    const imageExtensions = [
      'svg',
      'png',
      'jpg',
      'jpeg',
    ];

    getFiles({ rootPath, foldersToCheck, imageExtensions }).then((filteredFiles) => {
      console.log('🧐🧐🧐 filteredFiles', filteredFiles);
    });
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
