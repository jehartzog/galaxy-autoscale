import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    'phantomjs-prebuilt': '2.1.15',
    'webdriverio': '4.8.0'
}, 'avariodev:galaxy-autoscale');
