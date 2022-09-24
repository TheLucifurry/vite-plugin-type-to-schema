import { resolve } from 'path';
import { describe, expect, it } from 'vitest'
import typeToSchema from '../src';
import { importFromString } from 'module-from-string'
import { getExportedTypeNames } from '../src/getExportedTypeNames';

export interface IMockVitePlugin {
  load(id: string): string
  buildEnd(error?: Error): void
}

describe('basic', () => {
  it('to have only the schemas of types (and interfaces), that was exported', async () => {
    const plugin = typeToSchema() as IMockVitePlugin

    // Imitate plugin call by Vite
    const id: string = resolve(__dirname, './fixtures/type?schema')
    const build = plugin.load(id);

    const exportedNames = getExportedTypeNames(resolve(__dirname, './fixtures/type.ts'), true);
    const moduleOfSchemas = await importFromString(build);

    expect(exportedNames).toEqual(Object.keys(moduleOfSchemas));
  })

  it('custom suffix', async () => {
    const plugin = typeToSchema({
      suffix: '?custom-suffix',
    }) as IMockVitePlugin

    // Imitate plugin call by Vite
    const id: string = resolve(__dirname, './fixtures/type?custom-suffix')
    const build = plugin.load(id);
    const id2: string = resolve(__dirname, './fixtures/type?schema')
    const build2 = plugin.load(id2);

    expect(build).toBeDefined();
    expect(build2).not.toBeDefined();
  })

  it('types, that uses imported types', async () => {
    const plugin = typeToSchema() as IMockVitePlugin

    // Imitate plugin call by Vite
    const id: string = resolve(__dirname, './fixtures/importer?schema')
    const build = plugin.load(id);

    const moduleOfSchemas = await importFromString(build);

    expect(moduleOfSchemas['ImporterType']).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: false,
      definitions: {},
      type: 'object',
      required: ['a', 'b', 'c', 'd', 'e'],
      properties: {
        a: { type: 'number' },
        b: { type: 'boolean' },
        c: { type: 'string' },
        d: { type: 'object' },
        e: { type: 'array', items: {} },
      },
    });
  })

  // it('__TEST___', async () => {
  //   const plugin = viteTsJsonSchemaGenerator({
  //     suffix: '?schema',
  //     options: {
  //       // noExtraProps: true,
  //       // uniqueNames: true,
  //       // titles: true,
  //       // schemaId: 'https://json-schema.org/draft/2019-09/schema',
  //       extraTags: ['widget'], // Add 'widget' annotation

  //       minify: false,
  //     }
  //   }) as IMockVitePlugin
  //   //...
  // })
})