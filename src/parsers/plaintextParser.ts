import { TextDocument, Position } from "vscode";
import { Parser } from "../utils/parser";
import { ParsedComment } from "../types";

export default class TextParser extends Parser {
  private regex = /(#.*$)|("""[\s\S]*?""")/gm;
  parseComments(document: TextDocument): { start: Position; end: Position; comment: string; }[] {
    const sourceCode = document.getText();
    const parsedComments: ParsedComment[] = [];
    let match: RegExpExecArray | null;

    while ((match = this.regex.exec(sourceCode)) !== null) {
      const content = match[0];
      const start = match.index;
      const end = start + content.length;
      parsedComments.push({ content: this.util.extract(content), start, end });
    }
    return this.accumulateConsecutiveComments(parsedComments, document);
  }

}