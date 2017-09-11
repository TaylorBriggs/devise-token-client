module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai-sinon'],

    client: {
      mocha: {
        ui: 'bdd'
      }
    },

    files: [],

    exclude: [],

    preprocessors: {},

    reporters: ['dots'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['ChromeHeadless'],

    singleRun: false,

    concurrency: Infinity
  })
}
