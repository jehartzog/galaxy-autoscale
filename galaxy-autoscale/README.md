

This package is built with [prodOnly](http://docs.meteor.com/api/packagejs.html#PackageNamespace-describe) set to true, so it will only be bundled with your production build.


This script is an act of desperation after failing to find any decent way to auto-scale [Meteor Galaxy](https://www.meteor.com/hosting). It's literally insane that they do not offer any variant of:

  - Automated alerts
  - API access
  - Auto-scaling rules

Considering how incredibly easy they made it to manually scale your containers, I got tired of having to log on twice a day to click 'up' in the morning and 'down' late at night, and I figured a janky script could do that job. And this project was born.

It uses webdriverio and phantomjs to login to your Meteor Galaxy account, scrape the current app status, and apply some simple logic to scale the number of containers up or down.

I set it up using a t2.nano AWS EC2 instance, set it up with cron, and let it go. It can probably be used more efficiently with Lamba, but that's more work than I want to put into this.

Obviously, it comes with no warranty. It will probably destroy your production environment. You've been warned.

If you are crazy enough to try it out, you need to create `auth-info.json` in the directory with the following info:
```JSON
{
    "appName": "your.galaxy.domain",
    "galaxyUsername": "username",
    "galaxyPassword": "password"
}
```

Tested on MacOS and Ubuntu running Node V7.