// Created by J. Eric Hartzog on 7/19/17

import { GalaxyAutoScale } from '../galaxy-autoscale';

const log = ({ level, message }) => {
    if (!GalaxyAutoScale.options.log) {
        return;
    }

    if (GalaxyAutoScale.options.logger != null) {
        GalaxyAutoScale.options.logger({ level, message });
    } else {
        if (level === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
    }
}

export default log;