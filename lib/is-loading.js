// Created by J. Eric Hartzog on 7/19/17

const isLoading = async (page, opts) => {
    const spinnerSelector = 'div.loading-spinner';
    // Wait until the spinner is shown on the page
    await page.waitForSelector(spinnerSelector, { timeout: opts.loadingTimeoutMs });
    // console.log('spinner found');
    // Then wait until the spinner is hidden from view
    await page.waitForSelector(
        spinnerSelector,
        { hidden: true, timeout: opts.loadingTimeoutMs }
    );
    // console.log('spinner hidden');
}

export default isLoading;