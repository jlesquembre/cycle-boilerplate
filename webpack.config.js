const webpack = require('webpack');
const {resolve} = require('path');
const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {getIfUtils, removeEmpty} = require('webpack-config-utils')

const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = env => {

  // ifUtils returns true/false when given no arguments
  const {ifProd, ifDev} = getIfUtils(env);

  // multiple extract instances
  let extractCssCustom = new ExtractTextPlugin({filename: 'style.[contenthash].css', allChunks: true, disable: !env.prod });
  let extractCssVendor = new ExtractTextPlugin({filename: 'vendor.[contenthash].css', disable: !env.prod });

  return validate({
    entry: {
      app: './app.js',
      vendor: ['rxjs', 'xstream', '@cycle/dom', '@cycle/rxjs-run', 'normalize.css/normalize.css'],
    },
    output: {
      filename: env.prod ? '[name].[chunkhash].js' : '[name].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod,
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map' : 'eval-source-map',
    bail: env.prod,
    //bail: true,
    postcss: function (webpack) {
      return [
        require("postcss-cssnext")(),
        require("postcss-browser-reporter")(),
        require("postcss-reporter")()
      ]
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loader: extractCssVendor.extract({
            fallbackLoader: 'style', // loader(s) to use when css not extracted
            loader: 'css'
          }),
          include: /node_modules/
        },
        {
          test: /\.css$/,
          loader: extractCssCustom.extract({
            fallbackLoader: 'style',
            loader: ['css?' +
              // Minification added with the LoaderOptionsPlugin
              //(env.prod ? 'minimize&' : '' ) +
              'modules&' +
              'sourceMap&' +
              'importLoaders=1&' +
              (env.prod ? '' : 'localIdentName=[name]__[local]___[hash:base64:5]'),
            'postcss']
          }),
          exclude: /node_modules/
        },
      ],
    },
    plugins: removeEmpty([
      extractCssCustom,
      extractCssVendor,
      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true,
      })),
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // eslint-disable-line
          warnings: false,
        },
        sourceMap: true,
      })),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        //minChunks: Infinity,
      }),
      ifDev(new DashboardPlugin()),
    ]),
    devServer: {
      quiet: ifDev(),  // required by DashboardPlugin
      stats: 'normal', // options: none, errors-only, minimal, normal, verbose, or otherwise you can specify your own object, see
                       // https://github.com/webpack/webpack/blob/v2.1.0-beta.15/lib/Stats.js#L720-L756
    },
  })
}
