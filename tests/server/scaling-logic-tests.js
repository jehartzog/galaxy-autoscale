// Created by J. Eric Hartzog on 7/19/17

// We care about this logic, let's make sure it's solid

import scalingLogic from '../../lib/scaling-logic.js';

// Default scaling rules used for testing
const scalingRules = {
    containersMin: 1,
    containersMax: 3,
    connectionsPerContainerMax: 100,
    connectionsPerContainerMin: 50,
};

const isEqual = (one, two) => {
    if (one != two) {
        throw new Error(`Not equal: ${one} != ${two}`);
    }
}

describe('scaling logic tests', function () {
    it('galaxy-autoscale - prevent scale down by min container', function () {
        const status = {
            connections: 0,
            cpu: 0.5,
            memory: 30,
            containers: 1,
            containerSize: 'compact',
        }

        const scaleResult = scalingLogic(status, scalingRules);

        isEqual(scaleResult, 0);
    })

    it('galaxy-autoscale - prevent scale up by max container', function () {
        const status = {
            connections: 10000,
            cpu: 0.5,
            memory: 30,
            containers: 3,
            containerSize: 'compact',
        }

        const scaleResult = scalingLogic(status, scalingRules);

        isEqual(scaleResult, 0);
    })

    it('galaxy-autoscale - scale up by connections per container', function () {
        const status = {
            connections: 201,
            cpu: 0.5,
            memory: 30,
            containers: 2,
            containerSize: 'compact',
        }

        const scaleResult = scalingLogic(status, scalingRules);

        isEqual(scaleResult, 1);
    })

    it('galaxy-autoscale - scale down by connections per container', function () {
        const status = {
            connections: 99,
            cpu: 0.5,
            memory: 30,
            containers: 2,
            containerSize: 'compact',
        }

        const scaleResult = scalingLogic(status, scalingRules);

        isEqual(scaleResult, -1);
    })
});
