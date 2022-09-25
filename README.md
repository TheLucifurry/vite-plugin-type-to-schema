# Vite-plugin-type-to-schema
> Plugin that converts types to JSON Schemas just via suffixed import

## 💿 Installation
```
pnpm i -D vite-plugin-type-to-schema # (or npm instead of pnpm)
# or
yarn add vite-plugin-type-to-schema --dev
```

## 👀 Usage
```js
// vite.config.js
import typeToSchema from 'vite-plugin-type-to-schema';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [typeToSchema()]
});
```

## ⚙️ Options 
[Source](./src/types.ts#L12)
#### name(optionality): defaultValue // Description
```js
typeToSchema({
  suffix?: '?schema' // Import path suffix
  dts?: 'schemas.d.ts' // Disable (false), or change path (string) of dts file 
  options?: {} // https://github.com/vega/ts-json-schema-generator#options
})
```

## 📃 Details

See [this test](./tests/compile.test.ts) and [fixture](./tests/fixtures/richType.ts) to learn behaviour of schema compiling