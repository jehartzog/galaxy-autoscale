A package to allow a Meteor app deployed on [Meteor Galaxy](https://www.meteor.com/hosting) to determine current usage and adjust the number of running containers.

Since there is no API to access this information, this package uses PhantomJS and webdriverio to scrape the information and interact with the Meteor Galaxy portal. Because of this, it is brittle and subject to breaking if MDG changes their UI, but is better than not having auto-scaling at all.

## Quickstart

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

## containersMin/containersMax

It will not scale above/below these numbers

### connectionsPerContainerMax

Once the connections per container reaches this number, it will add a single container

### connectionsPerContainerMin

Once the connections per container reaches this number, it will remove a single container

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

While working out how to do this, I started with a [standalone scrip](https://github.com/jehartzog/galaxy-phantomjs-autoscale) that can be run on Node. I set up a t2.nano AWS EC2 instance, set it up with cron, and it works just fine. If you want to keep this odd browser scraping script out of your webserver, than you can set it up that way.

After running the script on a Galaxy compact container with zero connections, CPU went to about 90% (0.4 ECU) and memory up by ~90MB for the 30 seconds this was running, so it does cause a brief impact on your webserver. On the other hand, if you are auto-scaling then you should always have some extra capacity, right? :D

### prodOnly

This package is built with [prodOnly](http://docs.meteor.com/api/packagejs.html#PackageNamespace-describe) set to true, so it will only be bundled with your production build. I recommend using a staging deployment to test this.

## Tests

Currently only the scaling logic functions are tested in `/tests/scaling-logic-tests.js` since testing the web scraping functions require Galaxy credentials to a running app.

Run the tests with `npm test`.

## License

MIT