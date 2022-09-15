import { Request } from 'express';

interface airQualityRes{
    status : string,
    data:{
        current: {
            pollution: {
                ts: string,
                aqius: number,
                mainus: string,
                aqicn: number,
                maincn: string
            }
        }
    }
};

interface location{
    lat:string,
    lon: string
}

const paris = {
    lon: '2.352222',
    lat: '48.856613'
}

type polutionReq = Request<{}, {}, {}, {longitude: number,latitude: number}>

export { airQualityRes, location, paris, polutionReq };