// Created by J. Eric Hartzog on 7/19/17

const login = async (page, opts) => {
    // Galaxy saves the login in localStorage, go ahead and clear it
    // await page.evaluate(() => {
    //     window.localStorage.clear();
    //     return new Promise(resolve => setTimeout(resolve, opts.stepDelayMs));
    // });

    const usernameSelector = '[name="username"]';
    await page.waitForSelector(usernameSelector);
    await page.type(usernameSelector, opts.username)
    await page.type('[name="password"]', opts.password)
    await page.click('form button[type="submit"]')
}

export default login;