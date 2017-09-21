// Created by J. Eric Hartzog on 7/19/17

const login = async (browser, opts) => {
    // Galaxy saves the login in localStorage, go ahead and clear it
    await browser.executeAsync((delay, done) => {
        window.localStorage.clear();
        setTimeout(() => done(), delay);
    }, opts.stepDelayMs);

    // Log in to the Galaxy service
    try {
        await browser.setValue('[name="username"]', opts.username)
        await browser.setValue('[name="password"]', opts.password)
        await browser.click('form button[type="submit"]')
    } catch (err) {
        // Catch the error tha that happens if already logged in
        // console.log(`Error trying to log in ${err}`);
    }
}

export default login;