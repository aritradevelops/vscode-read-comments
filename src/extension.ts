import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "read-comments" is now active!');
  let disposable = vscode.commands.registerCommand('read-comments.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Read Comments!');
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
