import { resolve } from 'path';
import { describe, expect, it } from 'vitest'
import viteTsJsonSchemaGenerator from '../src';
import { importFromString } from 'module-from-string'
import { getExportedTypeNames } from '../src/getExportedTypeNames';
import { IMockVitePlugin } from '../src/types';

describe('basic', () => {
  it('to have only the schemas of types (and interfaces), that was exported', async () => {
    const plugin = viteTsJsonSchemaGenerator() as IMockVitePlugin

    // Imitate plugin call by Vite
    const id: string = resolve(__dirname, './fixtures/type?schema')
    const build = plugin.load(id);

    const exportedNames = getExportedTypeNames(resolve(__dirname, './fixtures/type.ts'), true);
    const moduleOfSchemas = await importFromString(build);

    expect(exportedNames).toEqual(Object.keys(moduleOfSchemas));
  })

  // it('__TEST___', async () => {
  //   const plugin = viteTsJsonSchemaGenerator({
  //     suffix: '?schema',
  //     options: {
  //       // noExtraProps: true,
  //       // uniqueNames: true,
  //       // titles: true,
  //       // schemaId: 'https://json-schema.org/draft/2019-09/schema',
  //       extraTags: ['widget'], // Add "widget" annotation

  //       minify: false,
  //     }
  //   }) as IMockVitePlugin
  //   //...
  // })
})