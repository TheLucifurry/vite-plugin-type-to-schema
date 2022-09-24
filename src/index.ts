import { createGenerator } from 'ts-json-schema-generator';
import { basename } from 'path'
import { ERROR_PREFIX, NAME } from './consts';
import { generateDeclarationFile } from './dtsGenerator';
import { resolveConfig } from './resolveConfig';
import { TJSGConfig, IMockJSONSchema, IConfig, ISchemaFilesMetaList } from './types';
import type { Plugin } from 'vite';

// TODO: Make custom type formatter, that compiles name "integer" as "integer" type
function handleFile(cfg: TJSGConfig): {
  code: string,
  exportedNames: string[]
} | never {
  let rootSchema: IMockJSONSchema;
  try {
    const generator = createGenerator(cfg);
    rootSchema = generator.createSchema(cfg.type) as IMockJSONSchema;
  } catch (error) {
    throw new SyntaxError(`${ERROR_PREFIX}${error}`);
  }

  if (rootSchema == null) {
    throw new Error(`${ERROR_PREFIX}Incorrect TJS schema of "${cfg.path}"`);
  }
  if (!Object.keys(rootSchema.definitions).length) {
    throw new Error(`${ERROR_PREFIX}Schema "${cfg.path}" has no exported types`);
  }

  let code = '';
  const exportedNames: string[] = [];
  const resTable = {} as IMockJSONSchema;
  for (const [schemaName, originalSchema] of Object.entries(rootSchema.definitions)) {
    const schemaVersion = rootSchema.$schema;
    const schema = JSON.parse(JSON.stringify(originalSchema)) as IMockJSONSchema;
    const defs = JSON.parse(JSON.stringify(rootSchema.definitions));
    delete defs[schemaName];

    // @ts-ignore
    Object.assign(schema, {
      $schema: schemaVersion,
      type: 'object',
      definitions: defs,
    })

    // TODO: make readonly export for schemas
    code += `export const ${schemaName} = ${JSON.stringify(schema)};`;
    exportedNames.push(schemaName)

    resTable[schemaName] = schema;
  }

  return { code, exportedNames };
}

export default function viteTsJsonSchemaGenerator(config?: IConfig): Plugin {
  const root = process.cwd();
  const cfg = resolveConfig(config, root);
  const { suffix, options, dts } = cfg;

  const schemaFilesMeta: ISchemaFilesMetaList = {}

  function onUpdate() {
    if (dts) {
      generateDeclarationFile(cfg, dts, schemaFilesMeta)
    }
    debugger
  }

  return {
    name: NAME,
    load(id) {
      if (!id.endsWith(suffix)) return;

      const purePath = id.replace(suffix, '');
      const fileName = basename(purePath, '.ts');
      debugger
      const pathWithExt = purePath.endsWith('.ts') ? purePath : `${purePath}.ts`;
      const tjsgConfig: TJSGConfig = {
        ...options,
        path: pathWithExt,
        type: "*",
      };

      const result = handleFile(tjsgConfig);
      schemaFilesMeta[fileName] = { exports: result.exportedNames };
      debugger

      return result.code;
    },
    buildEnd(err) {
      if (err) return;

      onUpdate();
    }
  };
}
