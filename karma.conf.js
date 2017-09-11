module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai-sinon'],

    client: {
      mocha: {
        ui: 'bdd'
      }
    },

    files: [
      'test/auth_test.js'
    ],

    exclude: [],

    preprocessors: {
      'test/auth_test.js': ['webpack']
    },

    webpack: {
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['dots'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['ChromeHeadless'],

    singleRun: true,

    concurrency: Infinity
  })
}
