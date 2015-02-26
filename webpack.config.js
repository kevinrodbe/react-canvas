module.exports = {
  // Build
  build: {
    cache: true,
    watch: true,

    entry: {
      'listview': ['./examples/listview/app.js'],
      'timeline': ['./examples/timeline/app.js'],
      'css-layout': ['./examples/css-layout/app.js']
    },

    output: {
      filename: '[name].js'
    },

    module: {
      loaders: [
        { test: /\.js$/, loader: 'jsx-loader!transform/cacheable?envify' },
      ]
    },

    resolve: {
      root: __dirname,
      alias: {
        'react-canvas': 'lib/ReactCanvas.js'
      }
    }
  },

  // Dist
  dist: [{
    cache: true,
    entry: { 'react-with-canvas': ['./lib/ReactCanvas.js'] },
    output: {
      filename: '[name].js',
      pathinfo: false,
      library: 'ReactCanvas',
      sourcePrefix: ''
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'jsx-loader!transform/cacheable?envify' },
        { test: require.resolve('react'), loader: 'expose?React' }
      ]
    }
  }, {
    cache: true,
    entry: { 'react-with-addons-and-canvas': ['./lib/ReactCanvas.js'] },
    output: {
      filename: '[name].js',
      pathinfo: false,
      library: 'ReactCanvas',
      sourcePrefix: ''
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'jsx-loader!transform/cacheable?envify' },
        { test: require.resolve('node_modules/react/addons.js'), loader: 'expose?React' }
      ]
    },
    resolve: {
      root: __dirname,
      alias: { 'react$': 'node_modules/react/addons.js' }
    }
  }]
}
