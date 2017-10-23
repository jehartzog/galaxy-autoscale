// Created by J. Eric Hartzog on 10/23/17

import getCPUPerContainer from './cpu-per-container';

// Takes the raw information from scrape and returns calculated overall CPU usage percentage
const getCPUUsage = ({ cpu, containers, containerSize }) => {
    const cpuPerContainer = getCPUPerContainer(containerSize);
    const cpuCapacity = cpuPerContainer * containers;
    const cpuUsage = (cpu / cpuCapacity) * 100;

    return cpuUsage;
};

export default getCPUUsage;