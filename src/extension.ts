// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import say from 'say';
import { Disposable, ExtensionContext, StatusBarAlignment, commands, languages, window, workspace } from 'vscode';
import { CodelensProvider } from './codelensProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
  const codelensProvider = new CodelensProvider();

  languages.registerCodeLensProvider("*", codelensProvider);

  commands.registerCommand("read-comments.enableCodeLens", () => {
    workspace.getConfiguration("read-comments").update("enableCodeLens", true, true);
  });

  commands.registerCommand("read-comments.disableCodeLens", () => {
    workspace.getConfiguration("read-comments").update("enableCodeLens", false, true);
  });

  commands.registerCommand("read-comments.read", (id: number, text: string) => {
    console.log(text);
    const loader = window.createStatusBarItem(StatusBarAlignment.Left, 100);
    loader.text = 'Reading Comments';
    loader.show();
    say.speak(text, undefined, 1.0, (err) => {
      if (err) {
        console.log(err);
        window.showErrorMessage(`Something went wrong while trying to read the comment.`);
      }
      else {
        window.showInformationMessage(`Comment was read successfully.`);
      }
      loader.hide();
    });
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (disposables) {
    disposables.forEach(item => item.dispose());
  }
  disposables = [];
}