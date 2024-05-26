import { Position, TextDocument } from "vscode";
import { CommentUtils } from "./commetUtils";

export abstract class Parser {
  util = new CommentUtils();
  abstract parseComments(document: TextDocument): { start: Position, end: Position, comment: string }[];
}