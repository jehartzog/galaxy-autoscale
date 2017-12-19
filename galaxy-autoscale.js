/* Copyright J. Eric Hartzog (Avario, Inc.), 2017 */

import { SyncedCron } from 'meteor/percolate:synced-cron';

import runAutoScale from './lib/autoscale';

// Create the object with default options
const GalaxyAutoScale = {
    options: {
        log: true,
        logger: null,
        interval: 'every 15 minutes',
        jobName: 'galaxy-auto-scale',
        stepDelayMs: 5000,
        loadingTimeoutMs: 30000,
        // Good reading for these rules at http://galaxy-guide.meteor.com/scaling.html
        scalingRules: {
            containersMin: 1,
            containersMax: 3,
            // cpuUsageMax: 80,
            // memoryMax: 70,
            connectionsPerContainerMax: 80, // Scale up when conn/container reaches this
            connectionsPerContainerMin: 40, // Scale down when conn/container reaches this
        },
    },
};

const optionsAreValid = (opts) => {
    if ((!opts.appName && !opts.appUrl) || !opts.username || !opts.password) {
        return false;
    }

    return true;
};

GalaxyAutoScale.config = (opts) => {
    GalaxyAutoScale.options = Object.assign({}, GalaxyAutoScale.options, opts);
};

GalaxyAutoScale.addSyncedCronJob = () => {
    if (!optionsAreValid(GalaxyAutoScale.options)) {
        throw new Error('Tried to start GalaxyAutoScale with invalid options set.');
    }

    Meteor.startup(() => {
        SyncedCron.add({
            name: GalaxyAutoScale.options.jobName,
            schedule(parser) {
                return parser.text(GalaxyAutoScale.options.interval);
            },
            job() {
                runAutoScale(GalaxyAutoScale.options);
            },
        });
    });
};

GalaxyAutoScale.startSyncedCron = () => {
    Meteor.startup(() => {
        SyncedCron.start()
    });
};

GalaxyAutoScale.runAutoScale = () => {
    runAutoScale(GalaxyAutoScale.options);
};

export { GalaxyAutoScale };