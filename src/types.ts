import type { Config as TJSGConfigOrig } from 'ts-json-schema-generator';

// TODO: Replace by full type defs (e.g. from ajv package)
export type IMockJSONSchema = {
  $schema: string
  definitions: object
  [key: string]: any
}

export type TJSGConfig = TJSGConfigOrig

export type IConfig = {
  /**
   * Import path suffix
   */
  suffix?: `?${string}`

  /**
   * `false` - don't generate dts file;
   * `path as string` - generate by that path and name
   */
  dts?: string | boolean

  /**
   * parser options
   * @see https://github.com/vega/ts-json-schema-generator#options
   */
  options?: Partial<Omit<TJSGConfigOrig, 'path' | 'type'>>
};

export type IConfigResolved = Required<IConfig & {
  dts: string | false
}>

export type ISchemaFilesMetaList = Record<string, {
  exports: string[]
}>
