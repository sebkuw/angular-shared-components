module.exports = function configureKarma(config) {
  config.set({
    frameworks: ['jasmine'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
        ],
      },
    },
  });
};
