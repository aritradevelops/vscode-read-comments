import { Position, TextDocument } from "vscode";
import * as ts from 'typescript';
import { forEachComment } from 'tsutils';
import { ParsedComment } from "../interfaces/parsedComment";
import { Parser } from "../utils/parser";
export default class TsParser extends Parser {

  parseComments(document: TextDocument): { start: Position; end: Position; comment: string }[] {
    const filePath = document.fileName;
    const source = ts.sys.readFile(filePath);
    if (source) {
      const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest);
      const parsedComments: ParsedComment[] = [];
      const soruceCode = sourceFile.getFullText();
      forEachComment(sourceFile, (_, cRange) => {
        parsedComments.push({
          content: this.util.extract(soruceCode.slice(cRange.pos, cRange.end + 1)),
          start: cRange.pos,
          end: cRange.end
        });
      }, sourceFile);
      // accumulate consecutive comments and read them at once
      const final: ReturnType<typeof this.parseComments> = [];
      let idx = 0;
      while (idx < parsedComments.length) {
        let { content, start, end } = parsedComments[idx];
        while (++idx < parsedComments.length) {
          if (parsedComments[idx].start === end + 1) {
            end = parsedComments[idx].end;
            content += ' ' + parsedComments[idx].content;
            continue;
          }
          break;
        }
        final.push({
          start: document.positionAt(start),
          end: document.positionAt(end),
          comment: content
        });
      }
      return final;
    }
    return [];
  }
}