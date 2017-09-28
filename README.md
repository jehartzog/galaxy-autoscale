A package to allow a Meteor app deployed on [Meteor Galaxy](https://www.meteor.com/hosting) to determine current usage and adjust the number of running containers.

Since there is no API to access this information, this package uses phantomjs and webdriverio to scrape the information and interact with the Meteor Galaxy portal.

## Quickstart

Install the package
```
meteor add avariodev:galaxy-autoscale
```

Install the NPM dependencies in your project (necessary separately due to [#2](https://github.com/jehartzog/galaxy-autoscale/issues/2))
```
meteor npm install --save phantomjs-prebuilt@2.1.15 webdriverio@4.8.0
```

Create the following file somewhere where it will only be loaded on the server
`/imports/server/galaxy-autoscale.js`
```js
import { GalaxyAutoScale } from 'meteor/avariodev:galaxy-autoscale';

Meteor.startup(() => {
  GalaxyAutoScale.config({
    appName: Meteor.settings.galaxy.appName,
    username: Meteor.settings.galaxy.username,
    password: Meteor.settings.galaxy.password,
    scalingRules: {
      containersMin: 1,
      containersMax: 3,
      connectionsPerContainerMax: 80,
      connectionsPerContainerMin: 40,
    },
  });

  GalaxyAutoScale.addSyncedCronJob();

  GalaxyAutoScale.start();
});
```

## Screenshots of Auto-Scaling in Action

Galaxy APM graphs of up-scaling with steadily rising connections
![autoscale-graph](./img/autoscale-graph.png "Auto-Scale Graph")

Meteor Galaxy log of down-scaling
![autoscale-logs](./img/autoscale-log.png "Auto-Scale Logs")

## Important Note if Already Using Synced-Cron

This package uses [percolate:synced-cron](https://github.com/percolatestudio/meteor-synced-cron) to manage the timing of running the script, along with ensuring the script only gets run once per interval in a multiple-server deployment.

If you are already using `synced-cron` in your app, then do not run `GalaxyAutoScale.start();` as that is simply a wrapper around `SyncedCron.start()`.

## Configuration Information

### appName

This should be the end part of `https://galaxy.meteor.com/app/www.yourapp.com`, in this case `www.yourapp.com`.

## Scaling logic

Eventually I may add in better CPU/Memory based scaling, but since those numbers are more dynamic, I went with number of connections to start out.

The script does some basic math to calculate stats not provided by the Galaxy page:

- The overall CPU percentage being used (not currently used)
  - Total CPU ECU used / (# of containers * ECU per container)

- The overall connections per container
  - Number of connections / number of containers

### containersMin/containersMax

It will not scale above/below these numbers.

### connectionsPerContainerMax

Once the connections per container reaches this number, it will add a single container.

### connectionsPerContainerMin

Once the connections per container reaches this number, it will remove a single container.

## Scaling Interval

By default it runs every 15 minutes. To change this, add an `interval` value to the config. This `interval` value is passed to `synced-cron` which uses the [later.js](http://bunkat.github.io/later/) library.
```js
GalaxyAutoScale.config({ interval: 'every 15 minutes' });
```

## Manual Scaling Execution

If for whatever reason you want to manually run the auto-scaling script, call `GalaxyAutoScale.runAutoScale()`. Ensure you set your config settings first.

## Logging

By default it will log to console, you can disable logging by setting `GalaxyAutoScale.config({ log: false })`, or you can pass a custom logger in which it will use. For example:

```js
const loggerWrapper = ({ level, message }) => {
  myWinstonLogger.log(level, message);
};

Meteor.startup(() => {
  GalaxyAutoScale.config({
    ...
    logger: loggerWrapper,
  });
  ...
});
```

## Other Notes

### Alternative to running as Meteor package

While working out how to do this, I started with a [standalone scrip](https://github.com/jehartzog/galaxy-phantomjs-autoscale) that can be run on Node. I set up a nano AWS EC2 instance, set the script to run with cron, and it works just fine. If you want to keep this browser scraping script out of your webserver, than you can set it up that way.

After running the script on a Galaxy compact container with zero connections, CPU went to about 90% (0.4 ECU) and memory up by ~90MB for the 30 seconds this was running, so it does cause a brief impact on your webserver. On the other hand, if you are auto-scaling then you should always have some extra capacity, right? :D

## Tests

Currently only the scaling logic functions are tested in `/tests/scaling-logic-tests.js` since testing the web scraping functions require Galaxy credentials to a running app.

First ensure dependencies are installed with `npm install` and then run the tests with `npm test`.

## License

MIT