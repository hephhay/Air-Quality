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

interface extraReq{
    longitude: number,
    latitude: number
}

interface testReq{
    longitude: string,
    latitude: string
}

type polutionReq = Request<{}, {}, {}, extraReq>

export { airQualityRes, location, polutionReq, pollutionData, testReq };