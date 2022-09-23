import type { Config as TJSGConfigOrig } from 'ts-json-schema-generator';

// TODO: Replace by full type defs (e.g. from ajv package)
export type IMockJSONSchema = {
  $schema: string
  definitions: object
  [key: string]: any
}
export type TJSGConfig = TJSGConfigOrig
export type IConfig = {
  suffix: `?${string}`
  options?: Partial<Omit<TJSGConfigOrig, 'path' | 'type'>>
}

export interface IMockVitePlugin { // TODO: replace by "import type { Plugin } from 'vite';"
  load(id: string): string
}

