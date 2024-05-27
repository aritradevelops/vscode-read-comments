import * as vscode from 'vscode';
import * as constant from './constants';
import { CodeLensOptions } from './types';
import parserFactory from './parserFactory';
import configManager from './configManager';

function getSuitableCodeLens(range: vscode.Range, action: CodeLensOptions, ...args: any[]) {
  return new vscode.CodeLens(range, {
    arguments: args,
    title: constant.titleMap[action],
    command: constant.commandMap[action],
    tooltip: constant.hoverMessageMap[action]
  });
}

export class ReadCommentsCodeLensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
  constructor() {
    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }
  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    if (!configManager.enableCodeLens) { return []; }
    try {
      const codeLenses: vscode.CodeLens[] = [];
      if (vscode.workspace.getConfiguration("read-comments").get("enableCodeLens", true)) {
        let allComments = '';
        const parser = parserFactory.getParser(document.languageId);
        const comments = parser.parseComments(document);
        for (const idx in comments) {
          const comment = comments[Number(idx)];
          codeLenses.push(
            getSuitableCodeLens(new vscode.Range(comment.start, comment.end), 'read', Number(idx), comment.comment),
            getSuitableCodeLens(new vscode.Range(comment.start, comment.end), 'pause'),

          );
          allComments += comment.comment;
        }
        codeLenses.push(
          getSuitableCodeLens(new vscode.Range(0, 0, 0, 0), 'readAll', comments.length, allComments),
          getSuitableCodeLens(new vscode.Range(0, 0, 0, 0), 'pause'),
        );
        // on successful parsing reset the codeLenses
        this.codeLenses = codeLenses;
      }
    } catch (error) {
      console.error('Read Comments : An error occurred while parsing => ', error);
    }
    return this.codeLenses;
  }

}
