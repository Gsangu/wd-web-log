import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';

// 处理node的内置模块,发布node的第三方{builtins, globals}
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';

import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'WdWebLog',
			file: pkg.browser,
			format: 'umd',
			exports: 'default'
		},
		plugins: [
			resolve(),  // 这样 Rollup 能找到 `ms`
			commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
			eslint({
				throwOnError: true,
				throwOnWarning: true,
				include: ['src/**'],
				exclude: ['node_modules/**']
			}),
			replace({
				exclude: 'node_modules/**',
				SDK_VERSION: JSON.stringify(process.env.npm_package_version),
			}),
			babel({
				exclude: 'node_modules/**',
				// 使plugin-transform-runtime生效
				runtimeHelpers: true,
			}),
			!isDev && terser()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: ['ms'],
		output: [
			{ file: pkg.module, format: 'es' }
		]
	}
];
