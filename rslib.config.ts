import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    target: 'web',
  },
  source: {
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    {
      bundle: false,
      dts: true,
      syntax: 'es6',
      format: 'esm',
      source: {
        entry: {
          index: ['./src/**'],
        },
      },
      output: {
        distPath: { root: './es' },
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
      syntax: 'es6',
      output: {
        minify: true,
        distPath: { root: './dist' },
      },
    },
  ],
});
