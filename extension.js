const vscode = require("vscode");
const path = require("path");

function minifyCode(code) {
  // Remove all comments
  code = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

  // Remove all newlines and extra whitespace
  code = code.replace(/\r?\n|\r|\s+/g, " ");

  // Remove all extra whitespace between characters
  code = code.replace(/>\s+</g, "><");

  return code;
}

function closeOutputFile(filePath) {
  const textDocument = vscode.workspace.textDocuments.find(
    (document) => document.fileName === filePath
  );

  if (textDocument) {
    const editor = window.visibleTextEditors.find(
      (editor) => editor.document === textDocument
    );
    editor.close();
  }
}

/* This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let searchAndReplace = vscode.commands.registerCommand(
    "op-GPT-mize.searchAndReplace",
    async function execute() {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText();
        if (!selectedText) {
          vscode.window.showInformationMessage("No text available");
          return;
        }

        const find =
          (await vscode.window.showInputBox({
            placeHolder: "Enter Search text",
          })) || "";
        if (!find) {
          vscode.window.showInformationMessage("No Info Provided");
          return;
        }

        const replace =
          (await vscode.window.showInputBox({
            placeHolder: "Enter Replace text",
          })) || "";
        if (!find) {
          vscode.window.showInformationMessage("No Info Provided");
          return;
        }

        const regex = new RegExp(find, "g");
        const target = selectedText.replace(regex, replace);
        const htmlPath = path.resolve(
          context.extensionPath,
          "output/output.js"
        );
        const filePath = vscode.Uri.file(
          path.join(context.extensionPath, "output/output.js")
        );

        closeOutputFile(filePath);

        vscode.workspace.fs
          .writeFile(filePath, new Uint8Array(Buffer.from(target)))
          .then(
            () => {},
            (err) => {
              console.log(
                "Error occured on, search and replacing text: " + err
              );
            }
          );

        vscode.workspace.openTextDocument(htmlPath).then((doc) => {
          vscode.window.showTextDocument(doc, {
            ViewColumn: vscode.ViewColumn.Two,
          });
        });
      }

      vscode.window.showInformationMessage("Replaced text sucessfully!");
    }
  );

  let removeWhitespaces = vscode.commands.registerCommand(
    "op-GPT-mize.removeWhitespaces",
    async function execute() {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText();
        if (!selectedText) {
          vscode.window.showInformationMessage("No text available");
          return;
        }
  
        const target = minifyCode(selectedText);
        vscode.env.clipboard.writeText(target).then(() => {
          vscode.window.showInformationMessage("Copied to clipboard successfully!");
        });
      }
    }
  );
  

  // let removeWhitespaces = vscode.commands.registerCommand(
  //   "op-GPT-mize.removeWhitespaces",
  //   async function execute() {
  //     const editor = vscode.window.activeTextEditor;
  //     if (editor) {
  //       const selectedText = editor.document.getText();
  //       if (!selectedText) {
  //         vscode.window.showInformationMessage("No text available");
  //         return;
  //       }

  //       const target = minifyCode(selectedText);
  //       const htmlPath = path.resolve(
  //         context.extensionPath,
  //         "output/output.js"
  //       );
  //       const filePath = vscode.Uri.file(
  //         path.join(context.extensionPath, "output/output.js")
  //       );

  //       closeOutputFile(filePath);

  //       vscode.workspace.fs
  //         .writeFile(filePath, new Uint8Array(Buffer.from(target)))
  //         .then(
  //           () => {},
  //           (err) => {
  //             console.log("Error occured on, removing whitespaces: " + err);
  //           }
  //         );

  //       vscode.workspace.openTextDocument(htmlPath).then((doc) => {
  //         vscode.window.showTextDocument(doc, {
  //           viewColumn: vscode.ViewColumn.Two,
  //         });
  //       });
  //     }

  //     vscode.window.showInformationMessage("Removed whitespace sucessfully!");
  //   }
  // );

  let removeComments = vscode.commands.registerCommand(
    "op-GPT-mize.removeCodeComments",
    async function execute() {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText();
        if (!selectedText) {
          vscode.window.showInformationMessage("No text available");
          return;
        }

        let target = selectedText.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
        target = target.replace(/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/gm, "\n");
        const htmlPath = path.resolve(
          context.extensionPath,
          "output/output.js"
        );
        const filePath = vscode.Uri.file(
          path.join(context.extensionPath, "output/output.js")
        );

        closeOutputFile(filePath);

        vscode.workspace.fs
          .writeFile(filePath, new Uint8Array(Buffer.from(target)))
          .then(
            () => {},
            (err) => {
              console.log("Error occured on, removing comments: " + err);
            }
          );

        vscode.workspace.openTextDocument(htmlPath).then((doc) => {
          vscode.window.showTextDocument(doc, {
            viewColumn: vscode.ViewColumn.Two,
          });
        });
      }

      vscode.window.showInformationMessage("Removed comments sucessfully!");
    }
  );

  // let allOfTheAbove = vscode.commands.registerCommand(
  //   "op-GPT-mize.allOfTheAbove",
  //   async function execute() {
  //     const editor = vscode.window.activeTextEditor;
  //     if (editor) {
  //       const selectedText = editor.document.getText();
  //       if (!selectedText) {
  //         vscode.window.showInformationMessage("No text available");
  //         return;
  //       }

  //       const find =
  //         (await vscode.window.showInputBox({
  //           placeHolder: "Enter Search text",
  //         })) || "";
  //       if (!find) {
  //         vscode.window.showInformationMessage("No Info Provided");
  //         return;
  //       }

  //       const replace =
  //         (await vscode.window.showInputBox({
  //           placeHolder: "Enter Replace text",
  //         })) || "";
  //       if (!find) {
  //         vscode.window.showInformationMessage("No Info Provided");
  //         return;
  //       }

  //       const regex = new RegExp(find, "g");
  //       let target = selectedText.replace(regex, replace);

  //       target = minifyCode(target);

  //       const htmlPath = path.resolve(
  //         context.extensionPath,
  //         "output/output.js"
  //       );
  //       const filePath = vscode.Uri.file(
  //         path.join(context.extensionPath, "output/output.js")
  //       );

  //       closeOutputFile(filePath);

  //       vscode.workspace.fs
  //         .writeFile(filePath, new Uint8Array(Buffer.from(target)))
  //         .then(
  //           () => {},
  //           (err) => {
  //             console.log(
  //               "Error occured on, search and replacing text: " + err
  //             );
  //           }
  //         );

  //       vscode.workspace.openTextDocument(htmlPath).then((doc) => {
  //         vscode.window.showTextDocument(doc, {
  //           ViewColumn: vscode.ViewColumn.Two,
  //         });
  //       });
  //     }

  //     vscode.window.showInformationMessage("Both functions performed successfully!");
  //   }
  // );


  let allOfTheAbove = vscode.commands.registerCommand(
    "op-GPT-mize.allOfTheAbove",
    async function execute() {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText();
        if (!selectedText) {
          vscode.window.showInformationMessage("No text available");
          return;
        }
  
        const find =
          (await vscode.window.showInputBox({
            placeHolder: "Enter Search text",
          })) || "";
        if (!find) {
          vscode.window.showInformationMessage("No Info Provided");
          return;
        }
  
        const replace =
          (await vscode.window.showInputBox({
            placeHolder: "Enter Replace text",
          })) || "";
        if (!find) {
          vscode.window.showInformationMessage("No Info Provided");
          return;
        }
  
        const regex = new RegExp(find, "g");
        let target = selectedText.replace(regex, replace);
  
        target = minifyCode(target);
  
        vscode.env.clipboard.writeText(target).then(() => {
          vscode.window.showInformationMessage("Copied to clipboard successfully!");
        });
      }
    }
  );
  

  context.subscriptions.push(
    searchAndReplace,
    removeWhitespaces,
    // removeComments,
    allOfTheAbove
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
