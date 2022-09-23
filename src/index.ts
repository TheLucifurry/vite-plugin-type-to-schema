import { createGenerator } from 'ts-json-schema-generator';
import { ERROR_PREFIX, NAME } from './consts';
import { TJSGConfig, IMockJSONSchema, IConfig, IMockVitePlugin } from './types';

// TODO: Make custom type formatter, that compiles name "integer" as "integer" type
function handleFile(cfg: TJSGConfig): string | never {
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

  let resultCode = '';
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
    resultCode += `export const ${schemaName} = ${JSON.stringify(schema)};`;

    resTable[schemaName] = schema;
  }

  return resultCode
}

export default function viteTsJsonSchemaGenerator(config?: IConfig): IMockVitePlugin {
  const suffix = config?.suffix || '?schema';
  const options = config?.options || {};

  return {
    name: NAME,
    load(id) {
      if (!id.endsWith(suffix)) return;

      const purePath = id.replace(suffix, '');
      const pathWithExt = purePath.endsWith('.ts') ? purePath : `${purePath}.ts`;
      const tjsgConfig: TJSGConfig = {
        ...options,
        path: pathWithExt,
        type: "*",
      };

      return handleFile(tjsgConfig);
    },
  } as IMockVitePlugin;
}
