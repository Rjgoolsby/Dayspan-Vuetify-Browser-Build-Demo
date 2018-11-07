# This is a demo how to use Dayspan Vuetify in a browser based instance 
 
This demo is to show how to use dayspan-vuetify via script tags. This is based on the app.vue app based in the Dayspan-Vuetify Repo. 

See [Dayspan-Vuetify](https://github.com/ClickerMonkey/dayspan-vuetify) by [ClickerMonkey](https://github.com/ClickerMonkey) for the main repository  

See [app.vue](https://github.com/ClickerMonkey/dayspan-vuetify/blob/master/src/app.vue) for the demo that's in index.html and index.js.

## Step 1
### File: [build->webpack.lib.conf.js](https://github.com/ClickerMonkey/dayspan-vuetify/blob/master/build/webpack.lib.conf.js)

Comment out the externals function. Since we're importing this into the browser and this depends on moment and the dayspan.js library we need to package all these dependencies together since we can't import them like an es6 module.

```javascript
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.lib.env

baseWebpackConfig.entry = {
  'dayspan-vuetify': './src/lib.js'
}

var webpackConfig = merge(baseWebpackConfig, {
  // Comment this config out. Since we can't import an es6 module in a browser based vue instance we need to package dependencies together
  /* externals: [
    function(context, request, cb) {
      if(/^[a-z\-0-9]+$/.test(request)) {
        cb(null, 'commonjs ' + request);
        return;
      }
      cb();
    }
  ], */
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.lib.productionSourceMap,
      extract: true
    })
  },
  devtool: config.lib.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.lib.assetsRoot,
    filename: utils.assetsLibPath('[name].min.js'),
    library: '[name]',
    libraryTarget: 'umd'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsLibPath('[name].min.css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
})

if (config.lib.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.lib.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.lib.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```
## Step 2.
### File: [src->plugin.js](https://github.com/ClickerMonkey/dayspan-vuetify/blob/master/src/plugin.js)

There's a couple things to make this work with the demo docs. Some of this can be ignored but if you want to start with the src->app.vue template then you will need to do this.

You'll need the dayspan.js library but there's no sense in including it twice since it will packaged with the plugin itself but we need to be able to access it so we're going to add a DS variable to the Vue instance. We also need the dsMerge function for the demo app so we're going to create a new object for the vue instance called FC.

We need to be able to import the plugin via script tags. 

[Reference: https://alligator.io/vuejs/creating-custom-plugins/#automatic-installation](https://alligator.io/vuejs/creating-custom-plugins/#automatic-installation)


For people who use your plugin outside of a module system, it is often expected that if your plugin is included after the Vue script tag, that it will automatically install itself without the need to call Vue.use(). You can implement this by appending these lines to the end of my-vue-plugin.js:

```javascript
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(MyPlugin)
}
```
So adjust your plugin.js file to this


```javascript
import { dsMergeOptions, dsMergeValidate, dsValidate, dsDefaults, dsBind, dsMerge } from './functions';
import { default as Component } from './component';
import * as ComponentMap from './components'
import * as DS from 'dayspan'

const DayspanVuetify = {

  install(Vue, options)
  {
    // register all components globally
    for (var componentName in ComponentMap)
    {
      Vue.component( componentName, ComponentMap[ componentName ] );
    }

    // $dayspan is just another reactive component
    var $dayspan = new Vue( options
      ? dsMergeOptions( options, Component )
      : Component );


    // allow directives to access $dayspan
    Vue.$dayspan = $dayspan;

    // allow components to access $dayspan
    Vue.prototype.$dayspan = $dayspan;
    Vue.FC = {
      dsMerge : dsMerge,
    }
    Vue.DS = DS;

    // allow components to pull & merge default component props into given
    // component props.
    Vue.prototype.$dsValidate = dsMergeValidate;
    Vue.prototype.$dsDefaults = dsDefaults;

    // allow v-bind="{$scopedSlots}"
    Vue.prototype._b = dsBind(Vue.prototype._b);

    // Call initialization functions
    $dayspan.init();
  }

};


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(DayspanVuetify)
}

export default DayspanVuetify
```
Now you can build your own via `npm run build:lib`. to producte the files. 