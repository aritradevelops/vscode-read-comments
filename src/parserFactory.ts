import { Parser } from "./utils/parser";
import fs from 'node:fs';
import path from 'path';
import { isClass } from "./utils/helper";
import { TextDocument, Position } from "vscode";
class ParserFactory {
  private inventory: { [lang: string]: { new(): Parser } } = {};
  private parserContainer = path.resolve(__dirname, path.join('parsers'));
  private excludeList = ['index.ts'];
  constructor() {
    this.loadParsers();
  }

  protected loadParsers() {
    const files = fs.readdirSync(this.parserContainer);
    for (const file of files) {
      try {
        if (this.excludeList.includes(file) || fs.statSync(path.join(this.parserContainer, file)).isDirectory()) { continue; }
        const fileNameWithoutExtension = path.parse(file).name;
        const fileName = fileNameWithoutExtension.replace('Parser', '');
        const clsDefinition = require(path.join(this.parserContainer, fileNameWithoutExtension))?.default;
        if (!clsDefinition) { throw new Error(`PARSER_LOAD_ERROR: file: ${path.join(this.parserContainer, file)} has no "default" exported member`); }
        if (!isClass(clsDefinition)) { throw new Error(`PARSER_LOAD_ERROR: Expected default export of file: ${path.join(this.parserContainer, file)} to be a ClassDefinition found => ${clsDefinition}`); }
        this.inventory[fileName] = clsDefinition as typeof this.inventory[string];
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  }

  getParser(lang: string): Parser {
    if (lang in this.inventory) {
      return new this.inventory[lang]();
    }
    console.log(`Speaker: Sorry no suitable parser found for language ${lang}. Don't worry we're working on one...`);
    return new (class FallbackParser extends Parser {
      parseComments(document: TextDocument): { start: Position; end: Position; comment: string; }[] {
        return [];
      }
    })();
  }
}
export default new ParserFactory();