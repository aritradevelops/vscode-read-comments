import { ExtensionContext, commands, languages } from 'vscode';
import { ReadCommentsCodeLensProvider } from './codelensProvider';
import configManager from './configManager';
import speaker from './utils/speaker';

export function activate(context: ExtensionContext) {
  const codelensProvider = new ReadCommentsCodeLensProvider();
  const codelensDisposable = languages.registerCodeLensProvider("*", codelensProvider);

  const disableCodeLensCommand = commands.registerCommand("read-comments.disableCodeLens", () => {
    configManager.enableCodeLens = false;
  });
  const enableCodeLensCommand = commands.registerCommand("read-comments.enableCodeLens", () => {
    configManager.enableCodeLens = true;
  });
  const setSpeedCommand = commands.registerCommand("read-comments.speed", (speed: number) => {
    configManager.speed = speed;
  });
  const setVoiceCommand = commands.registerCommand("read-comments.voice", (voice: string) => {
    configManager.voice = voice;
  });
  const readCommand = commands.registerCommand("read-comments.read", speaker.read.bind(speaker));
  const pauseCommand = commands.registerCommand("read-comments.pause", speaker.pause.bind(speaker));

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
