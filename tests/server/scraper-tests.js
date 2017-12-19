// Created by J. Eric Hartzog on 11/29/17

import { assert } from 'meteor/practicalmeteor:chai';

import GalaxyAutoScale from '../../galaxy-autoscale.js';
import authInfo from './scraper-tests-auth.js';

describe('scrape galaxy', function () {
    it('will scrape and apply default rules', function () {
        GalaxyAutoScale.config({
            appUrl: authInfo.appUrl,
            username: authInfo.username,
            password: authInfo.password,
            scalingRules: {
                containersMin: 1,
                containersMax: 3,
                connectionsPerContainerMax: 80,
                connectionsPerContainerMin: 40,
            },
            alertRules: {
                cpuPercentageMax: 80,
            },
        });
        GalaxyAutoScale.runAutoScale();
    })
});
