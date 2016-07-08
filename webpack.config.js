const webpack = require('webpack');
const {resolve} = require('path');
const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = env => {

  const addPlugin = (add, plugin) => add ? plugin : undefined;
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const removeEmpty = array => array.filter(i => !!i);

  // multiple extract instances
  let extractCssCustom = new ExtractTextPlugin('style.[contenthash].css', { allChunks: true, disable: !env.prod });
  let extractCssVendor = new ExtractTextPlugin('vendor.[contenthash].css', { disable: !env.prod });

  return validate({
    entry: {
      app: './app.js',
      vendor: ['rxjs', 'xstream', '@cycle/dom', '@cycle/rxjs-run', 'normalize.css/normalize.css'],
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod,
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map' : 'eval-source-map',
    bail: env.prod,
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loader: extractCssVendor.extract('style', 'css'),
          include: /node_modules/
        },
        {
          test: /\.css$/,
          //loader: 'style-loader!css-loader?minimize&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
          loader: extractCssCustom.extract('style',
            'css?' +
              (env.prod ? 'minimize&' : '' ) + ////////////  Add autoprefixer, Done by postcss :)
              'modules&' +
              //(env.prod ? '': 'sourceMap&') + //////////
              'sourceMap&' + //////////
              'importLoaders=1&' +
              'localIdentName=[name]__[local]___[hash:base64:5]',
            'postcss'
          ),
          exclude: /node_modules/
          //loader: ExtractTextPlugin.extract([
          //  'style',
          //  {
          //    loader: "css",
          //    query: {
          //      //minimize: false,
          //      camelCase: true,
          //      modules: true,
          //      sourceMap: true,
          //      importLoaders: 1,
          //      //localIdentName: "[path][name]--[local]",
          //      localIdentName: '[name]__[local]___[hash:base64:5]',
          //    },
          //  },
          //  'postcss'
          //]),
          //loaders: ['style',
          //  'css?' +
          //    //'minimize&' +
          //    'modules&' +
          //    'sourceMap&' +
          //    'importLoaders=1&' +
          //    'localIdentName=[name]__[local]___[hash:base64:5]',
          //  //{ loader: 'css',
          //  //    query: { minimize: 1,
          //  //             modules: 1,
          //  //             sourceMap: 1,
          //  //             importLoaders: 1,
          //  //             localIdentName: '[name]__[local]___[hash:base64:5]',
          //  //    }
          //  //},
          //  //{ 'css': { minimize: 1,
          //  //           modules: 1,
          //  //           sourceMap: 1,
          //  //           importLoaders: 1,
          //  //           localIdentName: '[name]__[local]___[hash:base64:5]',
          //  //    }
          //  //},
          //  'postcss'
          //],
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
      //new webpack.optimize.CommonsChunkPlugin({
      //  name: 'css_vendor',
      //}),
    ]),
    devServer: {
      stats: 'normal', // options: none, errors-only, minimal, normal, verbose, or otherwise you can specify your own object, see
                       // https://github.com/webpack/webpack/blob/v2.1.0-beta.15/lib/Stats.js#L720-L756
    },

  })
}
