// Created by J. Eric Hartzog on 7/19/17

// import log from './log';

const spinnersAreVisible = async (browser) => {
    try {
        let spinners = await browser.getCssProperty('div.loading-spinner', 'opacity');

        // If we only get 1 result, make sure it's in an array
        if (!Array.isArray(spinners)) {
            spinners = [spinners];
        }

        return spinners.reduce((acc, cur) => {
            return acc || cur.value !== 0;
        }, false);
    } catch (err) {
        // If we can't find the spinners, then the page is still loading
        // log({ level: 'warn', message: err })
        return true;
    }
};

const isLoading = async (browser, opts) => {
    // If we are waiting for loading to complete after a step, go ahead and pause once
    await browser.pause(opts.stepDelayMs);

    let delay = 0;
    while (await spinnersAreVisible(browser)) {
        // console.log('Still loading, pausing...');
        await browser.pause(opts.stepDelayMs);
        delay += opts.stepDelayMs;
        if (delay > opts.loadingTimeoutMs) {
            throw new Error('Timeout while waiting for loading to finish');
        }
    }
}

export default isLoading;