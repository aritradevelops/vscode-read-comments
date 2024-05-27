import say from 'say';
import { StatusBarAlignment, window } from 'vscode';
import configManager from '../configManager';
import parserFactory from '../parserFactory';
class Speaker {
  private loader = window.createStatusBarItem(StatusBarAlignment.Right, 1000);
  protected loadAllCommentsFromActiveWindow() {
    if (!window.activeTextEditor) {
      return 'No active text editor found';
    }
    const doc = window.activeTextEditor.document;
    const parser = parserFactory.getParser(doc.languageId);
    const comments = parser.parseComments(doc);
    let allComments = '';
    for (const { comment } of comments) {
      allComments += ' ' + comment;
    }
    return allComments;
  }
  read(_id: number, text: string | undefined) {
    this.loader.text = '$(sync~spin) Reading';
    this.loader.show();
    if (typeof text === 'undefined') {
      text = this.loadAllCommentsFromActiveWindow();
    }
    say.speak(text, configManager.voice || undefined, configManager.speed, (err) => {
      if (err) {
        console.error(err);
        if ((<Error><unknown>err).message.includes('say.speak(): could not talk, had an error')) {
          //! means that it was paused
          window.showInformationMessage(`Comment was paused successfully.`);
        } else {
          window.showErrorMessage(`Something went wrong while trying to read the comment.`);
        }
      }
      else {
        window.showInformationMessage(`Comment was read successfully.`);
      }
      this.loader.hide();
    });
  }
  pause() {
    this.loader.text = '$(sync~spin) Pausing';
    this.loader.show();
    say.stop();
    this.loader.hide();
  }
}

export default new Speaker;