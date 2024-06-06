export class CommentUtils {
  private excludeList = ['\/', '#', '*', '!', '?', '\n', '"'];
  private getRegex() {
    return new RegExp(`[${this.excludeList.join('')}]`, 'g');
  }
  extract(fullComment: string) {
    // adding a full stop at the end so that the tts provider takes a pause
    // before reading the next line
    return fullComment.replace(this.getRegex(), ' ').trim() + '. ';
  }
  isEmpty(str: string) {
    // Regular expression to match any character that is not a space, newline, or tab
    const nonWhitespacePattern = /[^\s]/;
    return !nonWhitespacePattern.test(str);
  }
}