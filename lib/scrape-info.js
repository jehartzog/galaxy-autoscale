// Created by J. Eric Hartzog on 7/19/17

const scrapeInfo = async (page) => {
    await page.waitForSelector('div.section-cardinal.quarter');

    const result = await page.$$eval('div.section-cardinal.quarter .cardinal-numeral', divs => {
        const result = {};

        result.connections = divs[0].innerText;
        result.cpu = divs[1].innerText;
        result.memory = divs[2].innerText;

        return result;
    });

    result.containers = await page.$eval('div.section-cardinal.quarter input', input => input.value);

    const checkValue = val => {
        if (Number.isNaN(val)) {
            throw new Error('Found NaN while scraping, giving up');
        }
    }

    Object.values(result).forEach(val => checkValue(val));

    result.containerSize = await page.$eval('div.section-cardinal.quarter .cardinal-subtext', div => {
        const text = div.innerText.split(' ')[0];
        return text.toLowerCase();
    });

    return result;
};

export default scrapeInfo;