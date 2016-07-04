const webpack = require('webpack');
const {resolve} = require('path');
const validate = require('webpack-validator');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';


module.exports = env => {

  const addPlugin = (add, plugin) => add ? plugin : undefined;
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const removeEmpty = array => array.filter(i => !!i);

  return validate({
    entry: {
      app: './app.js',
      vendor: ['@cycle/dom', '@cycle/rxjs-run', '@reactivex/rxjs', 'xstream'],
    },
    output: {
      filename: 'bundle.[name].[chunkhash].js',
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
          //loader: 'style-loader!css-loader?minimize&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
          loaders: ['style',
            'css?' +
              //'minimize&' +
              'modules&' +
              'sourceMap&' +
              'importLoaders=1&' +
              'localIdentName=[name]__[local]___[hash:base64:5]',
            //{ loader: 'css',
            //    query: { minimize: 1,
            //             modules: 1,
            //             sourceMap: 1,
            //             importLoaders: 1,
            //             localIdentName: '[name]__[local]___[hash:base64:5]',
            //    }
            //},
            //{ 'css': { minimize: 1,
            //           modules: 1,
            //           sourceMap: 1,
            //           importLoaders: 1,
            //           localIdentName: '[name]__[local]___[hash:base64:5]',
            //    }
            //},
            'postcss'
          ],
        },
      ],
    },
    plugins: removeEmpty([
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
      })),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
    ]),

  })
}
