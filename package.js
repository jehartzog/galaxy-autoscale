Package.describe({
  name: 'avariodev:galaxy-autoscale',
  version: '1.0.0',
  summary: 'A server-only package to auto-scale Meteor Galaxy containers.',
  git: 'https://github.com/jehartzog/galaxy-autoscale.git',
  documentation: 'README.md',
  prodOnly: true
});

Npm.depends({
  'phantomjs-prebuilt': '2.1.15',
  // This is very odd, but Meteor fails to build the package when we just use 4.8.0.
  // It somehow works when I build it with 2.4.5, and then build again with 4.8.0 *shrug*
  'webdriverio': '4.8.0'
  // 'webdriverio': '2.4.5'
});

Package.onUse(function (api) {
  api.versionsFrom('1.5.2');
  api.use('ecmascript', 'server');
  api.use('percolate:synced-cron@1.1.1', 'server');
  // Import lib files
  api.addFiles([
    "lib/autoscale.js",
    "lib/cpu-per-container.js",
    "lib/is-loading.js",
    "lib/login.js",
    "lib/log.js",
    "lib/scaling-logic.js",
    "lib/scrape-info.js"
  ], 'server');
  // Import the main module
  api.mainModule('galaxy-autoscale.js', 'server');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('practicalmeteor:mocha');
  api.use('avariodev:galaxy-autoscale');
  api.addFiles('tests/server/scaling-logic-tests.js');
  api.mainModule('galaxy-autoscale-tests.js');
});
