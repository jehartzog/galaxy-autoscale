// Created by J. Eric Hartzog on 7/19/17

import phantomjs from 'phantomjs-prebuilt';
import webdriverio from 'webdriverio';

import scrapeInfo from './scrape-info';
import scalingLogic from './scaling-logic';
import isLoading from './is-loading';
import login from './login';
import log from './log';

runAutoScale = (opts) => {
    phantomjs.run('--webdriver=4444').then(async program => {
        let browser;

        try {
            log({ level: 'info', message: 'Running auto-scaler' });

            // Load phantomjs to the Galaxy management page
            const wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
            // For reason using await on this doesn't work, so we just pause after running it
            browser = webdriverio.remote(wdOpts)
                .init()
                .url(`https://galaxy.meteor.com/app/${opts.appName}`);
            await browser.pause(opts.stepDelayMs);

            // Login to the account
            await login(browser, opts);

            // Wait until all loading is complete
            await isLoading(browser, opts);

            // Scrape the current status
            const status = await scrapeInfo(browser);

            log({ level: 'info', message: `Current status: ${JSON.stringify(status, null, 2)}` })

            // Decide if any scaling action is needed
            const scaleAction = scalingLogic(status, opts.scalingRules);

            if (scaleAction > 0) {
                // We should be able to use browser.click() for this, but it doesn't work
                await browser.executeAsync((delay, done) => {
                    $('button.cardinal-action.increment').click();
                    setTimeout(() => done(), delay);
                }, opts.stepDelayMs);
                // console.log('Completed scaling up');
            }

            if (scaleAction < 0) {
                await browser.executeAsync((delay, done) => {
                    $('button.cardinal-action.decrement').click();
                    setTimeout(() => done(), delay);
                }, opts.stepDelayMs);
                // console.log('Completed scaling down');
            }
        } catch (err) {
            log({ level: 'error', message: err.toString() });
        } finally {
            // Make sure we kill phantomjs when we are done
            program.kill();
        }
    })
};

export default runAutoScale;