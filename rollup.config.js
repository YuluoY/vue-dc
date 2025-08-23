import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

const baseConfig = {
  input: 'index.js',
  external: ['vue'],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
    tryCatchDeoptimization: false,
    annotations: true,
    correctVarValueBeforeDeclaration: true,
    ignoreClassFieldInitialValues: true,
    preset: 'smallest',
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      }
    }),
    json(),
    resolve({
      preferBuiltins: true,
      mainFields: ['module', 'main']
    }),
    commonjs({
      ignoreDynamicRequires: true
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
          },
          modules: false,
          useBuiltIns: false
        }]
      ]
    })
  ]
};

export default [
  // ES 模块版本
  {
    ...baseConfig,
    output: {
      file: 'dist/vue-dc.esm.js',
      format: 'es',
      sourcemap: true
    }
  },
  // CommonJS 版本
  {
    ...baseConfig,
    output: {
      file: 'dist/vue-dc.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  },
  // UMD 版本
  {
    ...baseConfig,
    output: {
      file: 'dist/vue-dc.umd.js',
      format: 'umd',
      name: 'VueDC',
      sourcemap: true,
      exports: 'named',
      globals: {
        vue: 'Vue'
      }
    }
  },
  // 压缩版本
  {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 2,
          unsafe: true,
          unsafe_comps: true,
          unsafe_Function: true,
          unsafe_math: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true
        },
        mangle: {
          safari10: true,
          toplevel: true
        },
        format: {
          comments: false
        }
      })
    ],
    output: {
      file: 'dist/vue-dc.min.js',
      format: 'umd',
      name: 'VueDC',
      sourcemap: true,
      exports: 'named',
      globals: {
        vue: 'Vue'
      }
    }
  }
];
