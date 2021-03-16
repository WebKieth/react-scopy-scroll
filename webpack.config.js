const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
  {
    mode: 'production',
    entry: ['./src/scopyScroll'],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'reactScopyScroll.js',
      library: 'ReactScopyScroll',
      libraryTarget: 'umd',
      globalObject: "typeof self !== 'undefined' ? self : this"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: 'rcs-[local]'
                  },
                  localsConvention: 'dashes'
                }
              },
              { loader: 'sass-loader' }
            ]
          })
        },
        {
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          }
      ]
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: [
      new ExtractTextPlugin('scopyScroll.css')
    ],
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'prop-types': 'prop-types',
      lodash: 'lodash'
    }
  },
  {
    mode: 'production',
    entry: './example/main.js',
    output: {
      filename: 'example.js',
      path: path.resolve(__dirname, 'example/exampleDist')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      lodash: '_'
    }
  }
]