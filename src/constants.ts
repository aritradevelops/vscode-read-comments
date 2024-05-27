import { CodeLensOptions } from "./types";

export const titleMap: { [key in CodeLensOptions]: string } = {
  'read': 'Read Comment',
  'readAll': 'Read All Comments',
  'pause': 'Pause Reading'
} as const;
export const hoverMessageMap: { [key in CodeLensOptions]: string } = {
  'read': 'Read This comment.',
  'readAll': 'Read All comments.',
  'pause': 'Pause Reading.'
} as const;

export const commandMap: { [key in CodeLensOptions]: string } = {
  'read': 'read-comments.read',
  'readAll': 'read-comments.read',
  'pause': 'read-comments.pause'
} as const;

export const appIdentifier = 'read-comments' as const;