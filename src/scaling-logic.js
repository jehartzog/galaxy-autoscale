// Created by J. Eric Hartzog on 7/19/17

const getCPUPerContainer = require('./cpu-per-container');

// Returns 1 for scaling up, -1 for scaling down, 0 for do nothing
const scalingLogic = ({ connections, cpu, memory, containers, containerSize }) => {
    // Default values for mem and cpu from http://galaxy-guide.meteor.com/scaling.html
    const config = {
        containersMin: 1,
        containersMax: 4,
        // cpuUsageMax: 80,
        // memoryMax: 70,
        connectionsPerContainerMax: 75,
        connectionsPerContainerMin: 25,
    };

    // While we scrape directly from Galaxy, we want to convert for some useful CPU factors
    const cpuPerContainer = getCPUPerContainer(containerSize);
    const cpuCapacity = cpuPerContainer * containers;
    const cpuUsage = (cpu / cpuCapacity) * 100;

    const connectionsPerContainer = Number.parseFloat(connections) / containers;

    console.log('Calculated metrics', { cpuUsage, connectionsPerContainer });

    let scale = 0;

    if (containers < config.containersMin) {
        console.log(`Less than ${config.containersMin} containers, scaling up`);
        return 1;
    }

    if (containers > config.containersMax) {
        console.log(`More than ${config.containersMax} containers, scaling down`);
        return -1;
    }

    if (connectionsPerContainer > config.connectionsPerContainerMax && containers < config.containersMax) {
        console.log(`More than ${config.connectionsPerContainerMax} connections per container, scaling up`);
        return 1;
    }

    if (connectionsPerContainer < config.connectionsPerContainerMin && containers > config.containersMin) {
        console.log(`Less than ${config.connectionsPerContainerMin} connections per container, scaling down`);
        return -1;
    }

    console.log('No scaling action taken');
    return 0;
};

module.exports = scalingLogic;