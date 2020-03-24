// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getFiles } from './getFiles';
import { encodeImageAsBase64 } from './encodeImage';

// let IMAGES_HASH: { [key: string]: string } = {};
interface ImageWithHash {
  imageName: string;
  base64: string;
}
let IMAGES_ARRAY: ImageWithHash[] = [];

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

    // @TODO Read these in from VSCode Extension settings API
    const foldersToCheck = ['src', 'public'];
    const imageExtensions = [
      'svg',
      'png',
      'jpg',
      'jpeg',
    ];

    getFiles({ rootPath, foldersToCheck, imageExtensions }).then(async (imageFiles) => {
      // @TODO Save these images to the ExtensionContext.workspaceState.
      // @TODO Build up a hash map of the fileNames and the image files as base64 encoded images
      // https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript

      const base64Images = await Promise.all(imageFiles.map((imageFile) => {
        return encodeImageAsBase64(`${rootPath}/${imageFile}`);
      }));

      base64Images.map((base64Image, index) => {
        IMAGES_ARRAY.push({
          imageName: imageFiles[index],
          base64: base64Image,
        });
      });

      console.log('🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐 IMAGES_ARRAY', IMAGES_ARRAY);

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

      panel.webview.onDidReceiveMessage((event) => {
        console.log('message: ', event);
        vscode.window.showInformationMessage(`message: ${event}`);
        
        // @TODO Insert the image string at the cursor position

//         editor.edit(edit => {
//           let pos = new vscode.Position(editor.selection.start.line,
//                                         editor.selection.start.character)
//           edit.insert(pos, message.text);
//           panel.dispose()
      });

      panel.webview.html = createImageHtmlPage({ imageFiles: IMAGES_ARRAY, rootPath });

      // I don't think you can show HTML in the quickPick menu :/
      // Show quick pick menu so user can select an image
      // showQuickPick({ imageFiles, panel });
    });
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

interface CreateImageHtmlPageProps {
  imageFiles: Array<{ imageName: string; base64: string; }>;
  rootPath: string;
}

const createImageHtmlPage = ({ imageFiles, rootPath }: CreateImageHtmlPageProps) => {
  const imageFilesList = imageFiles.reduce((accumulator, imageFile) => {
    return accumulator += `
      <li class="ImageList-item">
        <div>
          <p><b>${imageFile.imageName}</b></p>
          
          <img class="ImageList-item-image" src="${imageFile.base64}" alt="${imageFile.imageName}" />
        </div>
        
        <div class="ImageList-item-buttons">
          <button onclick="insertImage('${imageFile.imageName}')">Insert image</button>
          <!-- <button onclick="toggleBackground()">☀/🌑</button> -->
        </div>
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
          <style>
            .ImageList {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              list-style: none;
              margin: 0;
              padding: 0;
            }

            .ImageList-item {
              margin: 8px;
              padding: 8px;
              border: 1px solid black;
              border-radius: 8px;

              display: flex;
              flex-direction: column;
            }

            .ImageList-item-image {
              height: 64px;
              width: 64px;
              padding: 4px;
            }

            .ImageList-item-buttons {
              display: flex;
              flex-direction: column;
            }
          </style>

          <h1>Image Viewer</h1>
          <hr />

          <h3>RootPath: ${rootPath}</h3>

          <ul class="ImageList">
          ${imageFilesList}
          </ul>

          <hr />

          <script>
            const vscode = acquireVsCodeApi();

            function insertImage(name) {
              vscode.postMessage('insertImage:' + name);
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