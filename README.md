## Features

- [Cycle.js](https://github.com/cyclejs/cyclejs) with [RxJS v5](http://reactivex.io/rxjs/)

- [Webpack 2](http://webpack.github.io/docs/)
	- Tree shaking
	- [webpack validator](https://github.com/js-dxtools/webpack-validator)
	- Production and development builds with only one config file (thanks to [webpack config utils](https://github.com/kentcdodds/webpack-config-utils))
	- [webpack dahsboard](https://github.com/FormidableLabs/webpack-dashboard)
  - Generate css files in production with (thanks to [extract text plugin](https://github.com/webpack/extract-text-webpack-plugin))
  - Minify js file in prodction (thanks to [UglifyJS](https://github.com/mishoo/UglifyJS2))

- [Babel](http://babeljs.io/) with [state 2 presets](http://babeljs.io/docs/plugins/preset-stage-2/)

- CSS
  - [normalize.css](https://necolas.github.io/normalize.css/)
  - [CSS modules](https://github.com/css-modules/css-modules)
  - [postcss](https://github.com/postcss/postcss)
  - [cssnext](http://cssnext.io/)

## Usage

- Develpment:

  ```bash
  npm run start
  ```

- Production build:

  ```bash
  npm run build:prod
  ```
