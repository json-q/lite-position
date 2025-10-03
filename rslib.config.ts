import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
      source: {
        entry: {
          index: ['./src/**'],
        },
      },
      output: {
        distPath: { root: './dist/es' },
      },
    },
    {
      bundle: true,
      format: 'umd',
      umdName: 'LitePosition',
      source: {
        entry: {
          index: './src/index.ts',
        },
      },
      output: {
        minify: true,
        distPath: { root: './dist/browser' },
      },
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [pluginReact()],
});
