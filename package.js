Package.describe({
  name: 'avariodev:galaxy-autoscale',
  version: '0.0.1',
  summary: '',
  git: 'https://github.com/jehartzog/galaxy-autoscale.git',
  documentation: 'README.md',
  prodOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2');
  api.use('ecmascript');
  api.use('percolate:synced-cron');
  api.mainModule('galaxy-autoscale.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('avariodev:galaxy-autoscale');
  api.mainModule('galaxy-autoscale-tests.js');
});

Npm.depends({
  'phantomjs-prebuilt': '2.1.15',
  webdriverio: '4.8.0',
});