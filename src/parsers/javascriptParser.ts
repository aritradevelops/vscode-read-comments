import { Position, TextDocument } from "vscode";
import * as espree from 'espree';
import { Parser } from "../utils/parser";
import { ParsedComment } from "../types";

export default class JsParser extends Parser {
  // written by chatGpt 💀 can be buggy
  parseComments(document: TextDocument): { start: Position; end: Position; comment: string }[] {
    const sourceCode = document.getText();
    const parsedComments: ParsedComment[] = [];

    const ast = espree.parse(sourceCode, {
      comment: true,
      loc: true,
      range: true,
      tokens: false,
      ecmaVersion: 'latest',
      sourceType: 'module'
    });
    //@ts-ignore
    ast.comments.forEach(comment => {
      parsedComments.push({
        content: this.util.extract(comment.value),
        start: comment.range[0],
        end: comment.range[1]
      });
    });
    return this.accumulateConsecutiveComments(parsedComments, document);
  }
}
