/*
 * Copyright © 2016 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
var webpack = require('webpack');
var mode = process.env.NODE_ENV || 'production';
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
let pathsToClean = [
  'common_dist'
];

// the clean options to use
let cleanOptions = {
  verbose: true,
  dry: false
};

const COMMON_LIB_NAME = 'common-lib-new';

var plugins = [
  new LodashModuleReplacementPlugin({
    shorthands: true,
    collections: true,
    caching: true
  }),
  new CleanWebpackPlugin(pathsToClean, cleanOptions),
  new CaseSensitivePathsPlugin(),
  // by default minify it.
  new webpack.DefinePlugin({
    'process.env':{
      'NODE_ENV': JSON.stringify(mode)
    },
  }),
  new ForkTsCheckerWebpackPlugin({
    tsconfig: __dirname + '/tsconfig.json',
    tslint: __dirname + '/tslint.json',
    // watch: ["./app/cdap"], // optional but improves performance (less stat calls)
    memoryLimit: 4096
  }),
];
var rules = [
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
  },
  {
    test: /\.ya?ml$/,
    use: 'yml-loader'
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
  },
  {
    test: /\.js$/,
    use: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.tsx?$/,
    use: [
      'babel-loader',
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
    ],
    exclude: [
      /node_modules/,
      /lib/
    ]
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }
    ]
  },
  {
    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: 'url-loader'
  },
  {
    test: /\.svg/,
    use: [
      {
        loader: 'svg-sprite-loader'
      }
    ]
  }
];
if (mode === 'production') {
  plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        compress: {
          warnings: false
        },
        output: {
          comments: false,
          beautify: false,
        }
      }
    })
  );
}
var webpackConfig = {
  mode,
  context: __dirname + '/app/common',
  optimization: {
    splitChunks: {
      name: COMMON_LIB_NAME,
      fileName: COMMON_LIB_NAME + '.js',
      minChunks: Infinity
    }
  },
  entry: {
    'common-new': ['./cask-shared-components.js'],
    [COMMON_LIB_NAME]: [
      '@babel/polyfill',
      'classnames',
      'reactstrap',
      'i18n-react',
      'sockjs-client',
      'react-dropzone',
      'react-redux',
      'svg4everybody',
      'numeral'
    ]
  },
  module: {
    rules
  },
  stats: {
    chunks: false,
    chunkModules: false
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
    path: __dirname + '/common_dist',
    library: 'CaskCommon',
    libraryTarget: 'umd',
    publicPath: '/common_assets/'
  },
  optimization: {
    splitChunks: false
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    'react-addons-css-transition-group': {
      commonjs: 'react-addons-css-transition-group',
      commonjs2: 'react-addons-css-transition-group',
      amd: 'react-addons-css-transition-group',
      root: ['React','addons','CSSTransitionGroup']
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      components: __dirname + '/app/cdap/components',
      services: __dirname + '/app/cdap/services',
      api: __dirname + '/app/cdap/api',
      wrangler: __dirname + '/app/wrangler',
      styles: __dirname + '/app/cdap/styles'
    }
  },
  plugins
};

module.exports = webpackConfig;
