## Features

- [Cycle.js](https://github.com/cyclejs/cyclejs) with [RxJS v5](http://reactivex.io/rxjs/)

- [Webpack 2](http://webpack.github.io/docs/)
	- Tree shaking
	- [~~webpack validator~~](https://github.com/js-dxtools/webpack-validator) No longer needed: [link](https://github.com/webpack/webpack/pull/2974)
	- Production and development builds with only one config file (thanks to [webpack config utils](https://github.com/kentcdodds/webpack-config-utils))
	- [Webpack dahsboard](https://github.com/FormidableLabs/webpack-dashboard) for dev build
  - [Webpack bundle analyzer](https://github.com/th0r/webpack-bundle-analyzer) for prod build
  - Generate css files in production with (thanks to [extract text plugin](https://github.com/webpack/extract-text-webpack-plugin))
  - Minify js file in prodction (thanks to [UglifyJS](https://github.com/mishoo/UglifyJS2))

- [Babel](http://babeljs.io/) with [state 2 presets](http://babeljs.io/docs/plugins/preset-stage-2/)

- CSS
  - [glamor (css-in-js)](https://github.com/threepointone/glamor)
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
