import * as vscode from 'vscode';
import TsParser from './parsers/typescriptParser';

export class CodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private parser = new TsParser();
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  constructor() {
    this.regex = /(.+)/g;

    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

    this.codeLenses = [];
    if (vscode.workspace.getConfiguration("read-comments").get("enableCodeLens", true)) {
      let allComments = '';
      if (vscode.window.activeTextEditor) {
        const comments = this.parser.parseComments(vscode.window.activeTextEditor.document);
        for (const idx in comments) {
          const comment = comments[Number(idx)];
          this.codeLenses.push(
            new vscode.CodeLens(new vscode.Range(comment.start, comment.end), {
              arguments: [Number(idx), comment.comment],
              title: 'read',
              command: 'read-comments.read',
              tooltip: "Read this comment",
            }),
            new vscode.CodeLens(new vscode.Range(comment.start, comment.end), {
              arguments: [Number(idx), comment.comment],
              title: 'pause',
              command: 'read-comments.pause',
              tooltip: "Pause reading this comment",
            }),
          );
          allComments += comment.comment;
        }
        this.codeLenses.push(
          new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
            arguments: [comments.length, allComments],
            title: 'read all',
            command: 'read-comments.read',
            tooltip: "Read this comment",
          }),
          new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
            arguments: [comments.length, allComments],
            title: 'pause',
            command: 'read-comments.pause',
            tooltip: "Pause reading all comment",
          }),
        );
      }
    }
    return this.codeLenses;
  }

}
