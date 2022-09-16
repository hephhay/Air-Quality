import rewire from 'rewire';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

import { airQualityRes, location } from '../util/types';
import * as utlilFunction from '../util/index';
import { BadRequestError } from '../errors'

describe('Testing getAirQuality controller', () => {

    let airQualityController =  rewire('../controller/air-quality');

    const sandbox = createSandbox();
    const test_data: airQualityRes = {
        "status": "success",
        "data": {
            "current": {
                "pollution": {
                    "ts": "2022-09-15T21:00:00.000Z",
                    "aqius": 33,
                    "mainus": "p2",
                    "aqicn": 16,
                    "maincn": "n2"
                }
            }
        }
    }

    let input: location;

    beforeEach(() => {
        input = {lat: '48.856613', lon: '-100.237474'};
    });

    const valueRange = async (value: 'lat' | 'lon') => {
        input[value] = '-248.545'
        return airQualityController.getAirQuality(input);
    }

    sandbox.stub(utlilFunction, 'pollutionEndpoint').returns('');
    sandbox.stub(utlilFunction, 'queryPollution').returns(Promise.resolve(test_data));

    describe('GET /', () => {

        it('should return error if longitude not in range', async () => {
            try{
                await valueRange('lon');
                throw new Error('⚠️ Unexpected success!');
            }
            catch(err: unknown){
                expect(err).to.be.instanceOf(BadRequestError);
                expect((err as BadRequestError).message).to.contain('longitude');
            }
        });

        it('should return error if latitude not in range', async () => {
            try{
                await valueRange('lat');
                throw new Error('⚠️ Unexpected success!');
            }
            catch(err: unknown){
                expect(err).to.be.instanceOf(BadRequestError);
                expect((err as BadRequestError).message).to.contain('latitude');
            }
        });

        it('should succeed if longitude and latitude is correct', async () => {
            const testReturnData = await airQualityController.getAirQuality(input);
            expect(testReturnData).to.equal(test_data.data.current.pollution);
            
        })
    });

});