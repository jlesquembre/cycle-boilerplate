const webpack = require('webpack');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {getIfUtils, removeEmpty} = require('webpack-config-utils')

const DashboardPlugin = require('webpack-dashboard/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {

  // ifUtils returns true/false when given no arguments
  const {ifProd, ifNotProd, ifDev} = getIfUtils(env);

  // multiple extract instances
  let extractCssCustom = new ExtractTextPlugin({filename: 'style.[contenthash].css', allChunks: true, disable: ifNotProd() });
  let extractCssVendor = new ExtractTextPlugin({filename: 'vendor.[contenthash].css', disable: ifNotProd() });

  return {
    entry: {
      app: './app.js',
      vendor: ['xstream', '@cycle/dom', '@cycle/rxjs-run', '@cycle/isolate',
               'glamor', 'normalize.css/normalize.css'],
    },
    output: {
      filename: ifProd() ? '[name].[chunkhash].js' : '[name].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: ifNotProd(),
    },
    context: resolve(__dirname, 'src'),
    devtool: ifProd() ? 'source-map' : 'eval-source-map' ,
    bail: ifProd(),
    //resolve: {
    //  alias: {
    //    rxjs: 'rxjs-es',
    //  },
    //},
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loader: extractCssVendor.extract({
            fallbackLoader: 'style-loader?insertAt=top', // loader(s) to use when css not extracted
            loader: 'css-loader?minimize'
          }),
          include: /node_modules/
        },
        {
          test: /\.css$/,
          loader: extractCssCustom.extract({
            fallbackLoader: 'style-loader?insertAt=top', // insert at top to work with glamor
            loader: ['css-loader?' +
              'minimize&' +
              'modules&' +
              'sourceMap&' +
              'importLoaders=1&' +
              (ifProd() ? '' : 'localIdentName=[name]__[local]___[hash:base64:5]'),
            'postcss-loader']
          }),
          exclude: /node_modules/
        },
      ],
    },
    plugins: removeEmpty([
      extractCssCustom,
      extractCssVendor,

      // DedupePlugin was removed, see:
      // https://github.com/webpack/webpack/pull/3266#issuecomment-260623603
      ifProd(new webpack.optimize.DedupePlugin()),

      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          //minimize: ifProd(),
          //debug: ifNotProd(),
          //quiet: ifProd(),
          postcss: [
            require("postcss-cssnext")(),
            require("postcss-browser-reporter")(),
            require("postcss-reporter")()
          ]
        },
      }),
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
        minify: {html5: true, collapseWhitespace: true},
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        //minChunks: Infinity,
      }),
      ifDev(new DashboardPlugin()),
      ifProd(new BundleAnalyzerPlugin()),
    ]),
    devServer: {
      quiet: ifDev(),  // required by DashboardPlugin
      stats: 'normal', // options: none, errors-only, minimal, normal, verbose, or otherwise you can specify your own object, see
                       // https://github.com/webpack/webpack/blob/v2.1.0-beta.15/lib/Stats.js#L720-L756
    },
  }
}
