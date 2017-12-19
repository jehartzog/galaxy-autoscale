## 3.0 (Dec 19, 2017)
* Removed phatonjs-prebuilt and webdriverio
* Added puppeteer

## 2.2.0 (October 23, 2017)
* Added logAlerts to allow configurable alerts to be logged if certain conditions are met.

## 2.1.0 (October 15, 2017)
* Added config settings for full appURL to support regions other than us-east-1 [#3](https://github.com/jehartzog/galaxy-autoscale/issues/3).

## 2.0.0 (September 28, 2017)

### Breaking Changes
* Switched to using phantomjs and webdriverio as peer dependencies due to [#2](https://github.com/jehartzog/galaxy-autoscale/issues/2).
* Removed `prodOnly` flag from `package.js`.

### New Features
* Exposed the runAutoScale() function.

### Updates
* Added `CHANGELOG.md`.

## 1.0.0 (September 21, 2017)

* Initial release
