Package.describe({
  name: 'avariodev:galaxy-autoscale',
  version: '3.0.0',
  summary: 'A server-only package to auto-scale Meteor Galaxy containers.',
  git: 'https://github.com/jehartzog/galaxy-autoscale.git',
  documentation: 'README.md'
});

Npm.depends({
  'puppeteer': '0.13.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.0.1');
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
  api.use('practicalmeteor:chai');
  api.use('percolate:synced-cron@1.1.1');
  api.use('avariodev:galaxy-autoscale');
  api.addFiles('tests/server/scaling-logic-tests.js');
  api.addFiles('tests/server/log-alert-tests.js');
  // api.addFiles('tests/server/scraper-tests.js', 'server');
  // api.addFiles('tests/server/scraper-tests-auth.js', 'server');
});
