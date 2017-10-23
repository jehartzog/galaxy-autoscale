// Created by J. Eric Hartzog on 10/23/17

import getCPUUsage from './cpu-usage-calc';
import log from './log';

// Takes the scraped info and decides whether to log an alert that will trigger a notification.
// Returns true if any alert generated, false otherwise (for testing).
const logAlerts = ({ connections, cpu, memory, containers, containerSize }, alertRules) => {
    // If no rules are set, don't generate any alerts
    if (!alertRules) {
        return false;
    }

    const cpuUsage = getCPUUsage({ cpu, containers, containerSize });

    if (cpuUsage > alertRules.cpuPercentageMax) {
        log({ level: 'warn', message: `Overall CPU usage at ${cpuUsage}%` });
        return true;
    }

    return false;
};

export default logAlerts;