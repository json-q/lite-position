import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig, type LibConfig } from '@rslib/core';

const commonUmdConfig: LibConfig = {
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
    distPath: { root: './dist/browser-polyfill' },
  },
};

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
      externalHelpers: true,
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
      ...commonUmdConfig,
      syntax: 'es5',
      output: {
        ...commonUmdConfig.output,
        distPath: { root: './dist/browser-polyfill' },
      },
    },
    {
      ...commonUmdConfig,
      externalHelpers: true,
      output: {
        ...commonUmdConfig.output,
        distPath: { root: './dist/browser' },
      },
    },
  ],
});
