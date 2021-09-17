import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

// 以下内容会添加到打包结果中
const footer = `
if(typeof window !== 'undefined') {
  window._WdWebLog_VERSION_ = '${pkg.version}'
}`

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      footer
    },
    {
      file: pkg.module,
      format: 'esm',
      footer
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'WdWebLog',
      footer
    }
  ],
  plugins: [
    typescript(),
    commonjs(),
    resolve(),
    terser()
  ]
}
