import { workspace } from 'vscode';
import { appIdentifier } from './constants';
import { SettingOptions } from './types';
class ConfigManager {
  private defaultVoice = "";
  private defaultEnableCodeLens = true;
  private defaultSpeed = 1.0;
  protected getSetting(name: SettingOptions) {
    return appIdentifier + '.' + name;
  }
  get voice(): string {
    return workspace.getConfiguration().get(this.getSetting('voice'), this.defaultVoice);
  }
  set voice(v: string) {
    workspace.getConfiguration().update(this.getSetting('voice'), v);
  }
  get enableCodeLens(): boolean {
    return workspace.getConfiguration().get(this.getSetting('enableCodeLens'), this.defaultEnableCodeLens);
  }
  set enableCodeLens(enableCodeLens: boolean) {
    workspace.getConfiguration().update(this.getSetting('enableCodeLens'), enableCodeLens);
  }
  get speed(): number {
    return workspace.getConfiguration().get(this.getSetting('speed'), this.defaultSpeed);
  }
  set speed(speed: number) {
    workspace.getConfiguration().update(this.getSetting('speed'), speed);
  }
}
export default new ConfigManager;