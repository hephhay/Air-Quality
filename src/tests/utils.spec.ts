
import { expect } from 'chai';
import { config } from 'dotenv';

import { pollutionEndpoint, queryPollution } from '../util';
import { airQualityRes } from '../util/types'

config();

describe('Testing utility functions', () => {

    const testInput = {lon: process.env.TEST_LON as string, lat: process.env.TEST_LAT as string};

    describe('Testing queryPollution', () => {

        it('should return status success', async () => {

            const testReturnValue = await queryPollution(pollutionEndpoint(testInput)) as airQualityRes;
            expect(testReturnValue.status).to.equal('success');
        });
    });
});