// Created by J. Eric Hartzog on 7/19/17

import { assert } from 'meteor/practicalmeteor:chai';

import scalingLogic from '../../lib/scaling-logic.js';

// Default scaling rules used for testing
const scalingRules = {
    containersMin: 2,
    containersMax: 3,
    connectionsPerContainerMax: 100,
    connectionsPerContainerMin: 50,
};

describe('scaling logic tests', function () {
    describe('min/max container tests', function () {
        it('prevent scale down by min container', function () {
            const status = {
                connections: 0,
                cpu: 0.5,
                memory: 30,
                containers: 2,
                containerSize: 'compact',
            }

            const scaleResult = scalingLogic(status, scalingRules);

            assert(scaleResult === 0, 'should not have scaled');
        })

        it('prevent scale up by max container', function () {
            const status = {
                connections: 10000,
                cpu: 0.5,
                memory: 30,
                containers: 3,
                containerSize: 'compact',
            }

            const scaleResult = scalingLogic(status, scalingRules);

            assert(scaleResult === 0, 'should not have scaled');
        })
    });

    describe('connection per container scaling logic', function () {
        it('scale up by connections per container', function () {
            const status = {
                connections: 201,
                cpu: 0.5,
                memory: 30,
                containers: 2,
                containerSize: 'compact',
            }

            const scaleResult = scalingLogic(status, scalingRules);

            assert(scaleResult === 1, 'should have scaled up');
        })

        it('scale down by connections per container', function () {
            const status = {
                connections: 149,
                cpu: 0.5,
                memory: 30,
                containers: 3,
                containerSize: 'compact',
            }

            const scaleResult = scalingLogic(status, scalingRules);

            assert(scaleResult === -1, 'should have scaled down');
        })
    });
});
