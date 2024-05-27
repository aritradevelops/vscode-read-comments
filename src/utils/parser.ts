import { Position, TextDocument } from "vscode";
import { CommentUtils } from "./commentUtils";

export abstract class Parser {
  util = new CommentUtils();
  abstract parseComments(document: TextDocument): { start: Position, end: Position, comment: string }[];
}