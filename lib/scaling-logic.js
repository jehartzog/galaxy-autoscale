// Created by J. Eric Hartzog on 7/19/17

import getCPUUsage from './cpu-usage-calc';
import log from './log';

// Returns 1 for scaling up, -1 for scaling down, 0 for do nothing
const scalingLogic = ({ connections, cpu, memory, containers, containerSize }, scalingRules) => {
    const cpuUsage = getCPUUsage({ cpu, containers, containerSize });

    const connectionsPerContainer = Number.parseFloat(connections) / containers;

    log({ level: 'info', message: `Calculated metrics: ${JSON.stringify({ cpuUsage, connectionsPerContainer }, null, 2)}` });

    let scale = 0;

    if (containers < scalingRules.containersMin) {
        log({ level: 'info', message: `Less than ${scalingRules.containersMin} containers, scaling up` });
        return 1;
    }

    if (containers > scalingRules.containersMax) {
        log({ level: 'info', message: `More than ${scalingRules.containersMax} containers, scaling down` });
        return -1;
    }

    if (connectionsPerContainer > scalingRules.connectionsPerContainerMax && containers < scalingRules.containersMax) {
        log({ level: 'info', message: `More than ${scalingRules.connectionsPerContainerMax} connections per container, scaling up` });
        return 1;
    }

    if (connectionsPerContainer < scalingRules.connectionsPerContainerMin && containers > scalingRules.containersMin) {
        log({ level: 'info', message: `Less than ${scalingRules.connectionsPerContainerMin} connections per container, scaling down` });
        return -1;
    }

    // log({ level: 'info', message: 'No scaling action taken' });
    return 0;
};

export default scalingLogic;