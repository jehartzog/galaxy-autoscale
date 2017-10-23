Package.describe({
  name: 'avariodev:galaxy-autoscale',
  version: '2.2.0',
  summary: 'A server-only package to auto-scale Meteor Galaxy containers.',
  git: 'https://github.com/jehartzog/galaxy-autoscale.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.5.2');
  api.use('ecmascript', 'server');
  api.use('percolate:synced-cron@1.1.1', 'server');
  api.use('tmeasday:check-npm-versions@0.3.1', 'server')
  // Import lib files
  api.addFiles([
    "check-npm-deps.js",
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
  api.use('avariodev:galaxy-autoscale');
  api.addFiles('tests/server/scaling-logic-tests.js');
  api.addFiles('tests/server/log-alert-tests.js');
  api.mainModule('galaxy-autoscale-tests.js');
});
