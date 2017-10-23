// Created by J. Eric Hartzog on 7/19/17

import { assert } from 'meteor/practicalmeteor:chai';

import logAlerts from '../../lib/log-alerts.js';
// Default scaling rules used for testing
const alertRules = {
    cpuPercentageMax: 80,
};

describe('log alert tests', function () {
    describe('cpu usage tests', function () {
        it('log an alert due to high cpu', function () {
            const status = {
                connections: 0,
                cpu: 0.81,
                memory: 30,
                containers: 2,
                containerSize: 'compact',
            }

            const alertResult = logAlerts(status, alertRules);

            assert(alertResult, 'did not correctly log alert');
        })

        it('not log an alert due to high cpu', function () {
            const status = {
                connections: 0,
                cpu: 0.79,
                memory: 30,
                containers: 2,
                containerSize: 'compact',
            }

            const alertResult = logAlerts(status, alertRules);

            assert(!alertResult, 'logged incorrect alert');
        })
    });
});
