import { healthResponse } from '../util/constants';

const healthCheckSync = () => healthResponse;

const healthCheckAsync = () => {
    return Promise.resolve(healthResponse);
}

export { healthCheckAsync, healthCheckSync }