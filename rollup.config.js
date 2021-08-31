import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'
import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import json from './package.json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import pkg from './package.json'
import path from 'path'

const fs = require('fs');


const libraryName = pkg.name
console.log(process.env.NODE_ENV)
let plugins = []
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  plugins.push(
    serve({
      open: false, // 是否打开浏览器
      contentBase: ['./demo/jquery/', 'dist'],
      historyApiFallback: true, // Set to true to return index.html instead of 404
      host: 'localhost',
      port: 4100,
      https: {
        key: fs.readFileSync('./demo/cert/server.key'),
        cert: fs.readFileSync('./demo/cert/server.crt'),
        ca: fs.readFileSync('./demo/cert/ca.crt'),
      }
    })
  )
  plugins.push(
    livereload({
      watch: 'dist',
      port: 12345,
      delay: 300,
      https: {
        key: fs.readFileSync('./demo/cert/server.key'),
        cert: fs.readFileSync('./demo/cert/server.crt'),
        ca: fs.readFileSync('./demo/cert/ca.crt'),
      }
    }
  ))
}
export default [{
  input: './src/index.js',
  output: {
    file: `./dist/${libraryName}-${json.version}-umd.js`,
    format: 'umd',
    name: 'Demo',
    banner: '/* eslint-disable */',
    sourcemap: true,
  },
  plugins: [
    alias({ // 配置路径别名
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: 'common', replacement: path.resolve(__dirname, './src/common')}
      ]
    }),
    postcss(), // 处理sdk样式
    resolve(), // 允许加载在node_modules中的第三方模块
    eslint({ // 配置eslint规则
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**'],
      exclude: ['node_modules/**']
    }),
    babel({ // 配置babel打包
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true,       // 使plugin-transform-runtime生效
    }),
    commonjs(),
    (process.env.NODE_ENV === 'production' && terser()), // 压缩
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
    })
    // (process.env.NODE_ENV === 'production' && uglify()),
  ].concat(plugins)
}, {
  input: 'src/index.js',
  external: ['ms'],
  output: [
    { file: `./dist/${libraryName}-${json.version}-cjs.js`, format: 'cjs', sourcemap: true, },
    { file: `./dist/${libraryName}-${json.version}-es.js`, format: 'es', sourcemap: true, }
  ],
  plugins: [
    postcss(), // 处理sdk样式
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true,       // 使plugin-transform-runtime生效
    }),
    (process.env.NODE_ENV === 'production' && terser()),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
    })
  ]
}]