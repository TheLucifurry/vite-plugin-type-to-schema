import { importFromString } from "module-from-string";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import typeToSchema from "../src";
import { IMockVitePlugin } from "./mockTypes";

const EXPECTED_SCHEMA_OF_RICH_TYPE = {
  $schema: "http://json-schema.org/draft-07/schema#",
  additionalProperties: false,
  definitions: {
    DefinitionLinked: { type: "number" },
  },
  type: "object",
  required: [
    "num",
    "int",
    "str",
    "bool",
    "arr",
    "obj",
    // "recursion",
    "defInlined",
    "defLinked",
    "fixedArr",
    "nestedArr",
    "fixedObj",
  ],
  properties: {
    num: { type: "number" },
    int: { type: "integer" },
    str: { type: "string" },
    bool: { type: "boolean" },
    arr: { items: {}, type: "array" },
    obj: { type: "object" },

    optional: { type: "number" },
    // recursion: { $ref: "#/definitions/RichType" }, // NOTE: Must be "#"
    defInlined: { type: "string" },
    defLinked: { $ref: "#/definitions/DefinitionLinked" },

    fixedArr: {
      type: "array",
      items: [{ type: "number" }, { type: "string" }, { type: "boolean" }],
      maxItems: 3,
      minItems: 3,
    },
    fixedObj: {
      type: "object",
      additionalProperties: false,
      required: ["fst", "snd", "trd"],
      properties: {
        fst: { type: "number" },
        snd: { type: "string" },
        trd: { type: "boolean" },
      },
    },

    nestedArr: {
      type: "array",
      items: {
        type: "array",
        items: { type: "number" },
      },
    },
  },
};

describe("compile", () => {
  it("RichType have correct schema", async () => {
    const plugin = typeToSchema() as IMockVitePlugin;

    // Imitate plugin call by Vite
    const id: string = resolve(__dirname, "./fixtures/richType?schema");
    const build = plugin.load(id);

    const moduleOfSchemas = await importFromString(build);

    expect(moduleOfSchemas["RichType"]).toEqual(EXPECTED_SCHEMA_OF_RICH_TYPE);
  });
});
