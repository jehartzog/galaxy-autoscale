// Created by J. Eric Hartzog on 7/19/17

const getCPUPerContainer = (containerSize) => {
    const conversion = {
        compact: 0.5,
        standard: 1.0,
        double: 2.1,
        quad: 4.1,
    };

    const result = conversion[containerSize];

    if (result == null) {
        throw new Error(`Found invalid container size ${containerSize}`);
    }

    return result;
};

export default getCPUPerContainer;