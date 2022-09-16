import { healthCheckSync, healthCheckAsync } from '../controller/health-check';
import { healthResponse } from '../util/constants';

import { expect } from 'chai';


describe('Test /health', () => {
    describe('Health check on sync controller', () => {
        it('health should be okay', () => {
            const actualResult = healthCheckSync();
            expect(actualResult).to.equal(healthResponse);
        });
    });

    describe('Health check on async controller', () => {
        it('health should be okay', async () => {
            const actualResult = await healthCheckAsync();
            expect(actualResult).to.equal(healthResponse);
        });
    });
});