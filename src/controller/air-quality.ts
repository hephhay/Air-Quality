import fetch from 'node-fetch';
import { airQualityRes, location } from '../util/types';
import { pollutionEndpoint } from '../util/index';

async function getAirQuality(query: location){
    const url = pollutionEndpoint(query)

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json()) as airQualityRes;
    return result.data.current.pollution;
}

export { getAirQuality}