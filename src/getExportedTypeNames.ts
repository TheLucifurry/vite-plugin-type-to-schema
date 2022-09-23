import fs from 'fs'
import { ERROR_PREFIX } from './consts';

export function getExportedTypeNames(codeOrPath: string, isPath = false): string[] | never {
  let code = codeOrPath;
  if (isPath) {
    code = fs.readFileSync(codeOrPath, 'utf8');
    if (!code) {
      throw new Error(`${ERROR_PREFIX}Can't read file "${codeOrPath}"`);
    }
  }
  // TODO: Refactor this unsafe exported names parser
  const exportedNames: string[] | null = code
    .match(/(?<=^export interface |^export type )\w+/mg);
  if (!exportedNames) {
    throw new Error(`${ERROR_PREFIX}Exported types not found in file "${codeOrPath}"`);
  }
  return exportedNames;
}