export type ClassDefinition<Class, StaticProps extends Record<string, any> = {}> = {
  new(...args: any[]): Class,
} & StaticProps;
export type CodeLensOptions = 'read' | 'readAll' | 'pause';
export type SettingOptions = 'voice' | 'speed' | 'enableCodeLens';
export interface ParsedComment {
  content: string
  start: number
  end: number
}

// declare global {
//   var rootPath: string
// }