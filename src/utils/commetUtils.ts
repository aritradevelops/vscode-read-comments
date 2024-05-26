export class CommentUtils {
  private excludeList = ['\/', '#', '*', '!', '?', '\n'];
  private getRegex() {
    return new RegExp(`[${this.excludeList.join('')}]`, 'g');
  }
  extract(fullComment: string) {
    return fullComment.replace(this.getRegex(), ' ').trim();
  }
}