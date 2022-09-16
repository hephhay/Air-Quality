import { Request } from 'express';

interface pollutionData{
    ts: string;
    aqius: number;
    mainus: string;
    aqicn: number;
    maincn: string;
}

interface airQualityRes{
    status : string,
    data:{
        current: {
            pollution: pollutionData
        }
    }
};

interface location{
    lat:string,
    lon: string
}

type polutionReq = Request<{}, {}, {}, {longitude: number,latitude: number}>

export { airQualityRes, location, polutionReq, pollutionData };