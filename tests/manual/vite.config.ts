import { resolve } from 'path';
import viteTsJsonSchemaGenerator from '../../src';

export default {
  build: {
    lib: {
      entry: resolve(__dirname, './importer.ts'),
      name: 'MyLib',
      fileName: 'out'
    }
  },
  plugins: [
    viteTsJsonSchemaGenerator(),
  ],
}