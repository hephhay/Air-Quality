import _ from "lodash";

// import { CustomAPIError } from '../errors';
import { airQualityRes, location, pollutionData } from '../util/types';
import { pollutionEndpoint, queryPollution } from '../util/index';
import { Pollution } from '../model';
import { BadRequestError } from '../errors'

async function getAirQuality(query: location){

    if (!_.inRange(parseInt(query.lat), -90, 90))
        throw new BadRequestError(`${query.lat} is not in latitude range of ${-90} to ${90}`);
        
    if (!_.inRange(parseInt(query.lon), -180, 180))
        throw new BadRequestError(`${query.lon} is not in longitude range of ${-180} to ${180}`);

        const url = pollutionEndpoint(query);

        const result = await queryPollution(url) as airQualityRes;

    return result.data.current.pollution;
}

async function maxDate(){
    return Pollution.maxPollutionTime();
}

export { getAirQuality, maxDate }