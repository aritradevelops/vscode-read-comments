import { Position, TextDocument } from "vscode";
import { CommentUtils } from "./commentUtils";
import { ParsedComment } from "../types";

export abstract class Parser {
  util = new CommentUtils();
  abstract parseComments(document: TextDocument): { start: Position, end: Position, comment: string }[];
  accumulateConsecutiveComments(parsedComments: ParsedComment[], document: TextDocument) {
    // Accumulate consecutive comments and read them at once
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
}