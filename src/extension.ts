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

    // @TODO Read these in from VSCode Extension settings API
    const foldersToCheck = ['src', 'public'];
    const imageExtensions = [
      'svg',
      'png',
      'jpg',
      'jpeg',
    ];

    getFiles({ rootPath, foldersToCheck, imageExtensions }).then((imageFiles) => {
      console.log('🧐🧐🧐 imageFiles', imageFiles);

      // @TODO Save these images to the ExtensionContext.workspaceState.

      vscode.window.showInformationMessage('Images cached!');

      // Show panel on right
      const panel = vscode.window.createWebviewPanel(
        'imageViewer',
        'Image Viewer',
        vscode.ViewColumn.Two,
        {
          // enableFindWidget: true,
          enableScripts: true,
        }
      );

      // @TODO Build up a hash map of the fileNames and the image files as base64 encoded images

      panel.webview.onDidReceiveMessage((event) => {
        console.log('message: ', event);
        vscode.window.showInformationMessage(`message: ${event}`);
      });

      panel.webview.html = createImageHtmlPage({ imageFiles, rootPath });

      // I don't think you can show HTML in the quickPick menu :/
      // Show quick pick menu so user can select an image
      // showQuickPick({ imageFiles, panel });
    });
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

interface CreateImageHtmlPageProps {
  imageFiles: string[];
  rootPath: string;
}

const createImageHtmlPage = ({ imageFiles, rootPath }: CreateImageHtmlPageProps) => {
  const host = 'http://localhost:8080/';

  const imageFilesList = imageFiles.reduce((accumulator, imageFile) => {
    return accumulator += `
      <li>
        <p><b>${imageFile}</b></p>
        <img src="${host}/${imageFile}" alt="Image no load :(" height="64" width="64" />
        
        <button onclick="insertImage()">Insert image</button>
        
        <script>
          function insertImage() {
            const imageName = "${imageFile}";
            vscode.postMessage('insertImage:' + imageName);

            insertImageWith(imageName);
          }
        </script>
      </li>
    `;
  }, '');

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Image Viewer</title>
      </head>
      <body>
          <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />

          <h1>Image Viewer</h1>
          <hr />

          <h3>RootPath: ${rootPath}</h3>
          <h3>Host: ${host}</h3>

          <ul>
          ${imageFilesList}
          </ul>

          <hr />

          <script>
            const vscode = acquireVsCodeApi();

            function insertImageWith(name) {
              // vscode.postMessage({ command: 'insertImage', name: name });
              vscode.postMessage("insertImage:" + name);
            }
          </script>
      </body>
    </html>
  `;
};

// interface ShowQuickPickProps {
//   imageFiles: string[];
//   panel: vscode.WebviewPanel;
// }

/**
 * Shows a pick list using window.showQuickPick().
 */
// async function showQuickPick({ imageFiles }: ShowQuickPickProps) {

// 	let i = 0;
// 	const result = await vscode.window.showQuickPick(imageFiles, {
// 		placeHolder: 'Select an image you would like to insert',
// 		onDidSelectItem: (item) => {
//       vscode.window.showInformationMessage(`Focus ${++i}: ${item}`);
      
//       panel.webview.html = '<p>Hello?</p>';
//     }
// 	});

// 	vscode.window.showInformationMessage(`Got: ${result}`);
// }

        // const panel = window.createWebviewPanel(
        //   'type_id', // Identifies the type of the webview. Used internally
        //   'Title', // Title of the panel displayed to the user
        //   vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
        //   {
        //     // Enable scripts in the webview
        //     enableScripts: true
        //   } // Webview options. More on these later.
        // );
        // panel.webview.html = res;
      // panel.webview.onDidReceiveMessage(
      //     message => {
      //       switch (message.command) {
      //       case 'use':
      //         console.log('use');
      //         editor.edit(edit => {
      //           let pos = new vscode.Position(editor.selection.start.line,
      //                                         editor.selection.start.character)
      //           edit.insert(pos, message.text);
      //           panel.dispose()
      //         });
      //         return;
      //       case 'hide':
      //         panel.dispose()
      //         console.log('hide');
      //         return;
      //       }
      //     },
      //     undefined,
      //     context.subscriptions
      //   );