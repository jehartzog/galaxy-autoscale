// Created by J. Eric Hartzog on 7/19/17

import puppeteer from 'puppeteer';

import scrapeInfo from './scrape-info';
import scalingLogic from './scaling-logic';
import isLoading from './is-loading';
import login from './login';
import log from './log';
import logAlerts from './log-alerts';

runAutoScale = async (opts) => {
    try {
        log({ level: 'info', message: 'Running auto-scaler' });

        const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 250,
        });

        const page = await browser.newPage();

        // If full appUrl is set, use that, otherwise use appName for compatibility
        const appUrl = opts.appUrl ? opts.appUrl : `https://galaxy.meteor.com/app/${opts.appName}`;

        await page.goto(appUrl);

        // Login to the account
        await login(page, opts);

        // Wait until all loading is complete
        // This shouldn't be needed, but Galaxy has some errors before logging in. Do a refresh to clear them.
        await new Promise(resolve => setTimeout(resolve, opts.stepDelayMs));
        await page.reload();
        await new Promise(resolve => setTimeout(resolve, opts.stepDelayMs));
        // The actual loading check isn't working, so disabled for now
        // await isLoading(page, opts);

        // Scrape the current status
        const status = await scrapeInfo(page);

        log({ level: 'info', message: `Current status: ${JSON.stringify(status, null, 2)}` })

        // Check if any log alerts need to be created from this status
        logAlerts(status, opts.alertRules);

        // Decide if any scaling action is needed
        const scaleAction = scalingLogic(status, opts.scalingRules);

        if (scaleAction > 0) {
            await page.click('button.cardinal-action.increment');
        }

        if (scaleAction < 0) {
            await page.click('button.cardinal-action.decrement');
        }
    } catch (err) {
        log({ level: 'error', message: `${err.name}\n${err.message}\n${err.stack}` });
    } finally {
        // Make sure we kill browser when we are done
        await browser.close();
    }
};

export default runAutoScale;