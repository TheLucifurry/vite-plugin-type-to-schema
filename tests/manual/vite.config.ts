import { resolve } from 'path';
import typeToSchema from '../../src';

export default {
  build: {
    lib: {
      entry: resolve(__dirname, './importer.ts'),
      name: 'MyLib',
      fileName: 'out'
    }
  },
  plugins: [
    typeToSchema(),
  ],
}