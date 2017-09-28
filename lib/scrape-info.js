// Created by J. Eric Hartzog on 7/19/17

const scrapeInfo = async (browser) => {
    const sections = await browser.elements('div.section-cardinal.quarter');

    // This is used to grab the numbers from the first 3 sections at the top
    const getNumberForSection = async (section) => {
        const sectionId = sections.value[section].ELEMENT;
        const numberElm = await browser.elementIdElement(sectionId, '.cardinal-numeral');
        const numberText = await browser.elementIdText(numberElm.value.ELEMENT);
        const number = Number.parseFloat(numberText.value);

        if (Number.isNaN(number)) {
            throw new Error('Found NaN while scraping, giving up attempt');
        }

        return number;
    }

    // This is used to grab the 4th number at the top, number of containers currently running
    const getCurrentNumberInstances = async () => {
        const sectionId = sections.value[3].ELEMENT;
        const numberElm = await browser.elementIdElement(sectionId, 'input');
        const numberText = await browser.elementIdAttribute(numberElm.value.ELEMENT, 'value');
        const number = Number.parseInt(numberText.value, 10);

        if (Number.isNaN(number)) {
            throw new Error('Found NaN while scraping, giving up attempt');
        }

        return number;
    }

    // Used to get the current container size
    const getContainerSize = async () => {
        const sectionId = sections.value[3].ELEMENT;
        const sizeElm = await browser.elementIdElement(sectionId, '.cardinal-subtext');
        const sizeText = await browser.elementIdText(sizeElm.value.ELEMENT);

        const size = sizeText.value.split(' ')[0];

        if (size == null || size.length <= 0) {
            throw new Error('Found NaN while scraping, giving up attempt');
        }

        return size.toLowerCase();
    }

    return {
        connections: await getNumberForSection(0),
        cpu: await getNumberForSection(1),
        memory: await getNumberForSection(2),
        containers: await getCurrentNumberInstances(),
        containerSize: await getContainerSize(),
    }
};

export default scrapeInfo;