import { ExtensionContext, commands, languages } from 'vscode';
import { ReadCommentsCodeLensProvider } from './codelensProvider';
import configManager from './configManager';
import speaker from './utils/speaker';

export function activate(context: ExtensionContext) {
  const codelensProvider = new ReadCommentsCodeLensProvider();
  const codelensDisposable = languages.registerCodeLensProvider("*", codelensProvider);

  const disableCodeLensCommand = commands.registerCommand("speaker.disableCodeLens", () => {
    configManager.enableCodeLens = false;
  });
  const enableCodeLensCommand = commands.registerCommand("speaker.enableCodeLens", () => {
    configManager.enableCodeLens = true;
  });
  const setSpeedCommand = commands.registerCommand("speaker.speed", (speed: number) => {
    configManager.speed = speed;
  });
  const setVoiceCommand = commands.registerCommand("speaker.voice", (voice: string) => {
    configManager.voice = voice;
  });
  const readCommand = commands.registerCommand("speaker.read", speaker.read.bind(speaker));
  const pauseCommand = commands.registerCommand("speaker.pause", speaker.pause.bind(speaker));

  // Adding each disposable to the context's subscriptions
  context.subscriptions.push(
    codelensDisposable,
    disableCodeLensCommand,
    enableCodeLensCommand,
    setSpeedCommand,
    setVoiceCommand,
    readCommand,
    pauseCommand
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  // Clean up any resources here if necessary
}
