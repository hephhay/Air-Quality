
import  express  from 'express';
import {Pollution} from '../model';

import { getAirQuality } from '../controller/air-quality';
import { polutionReq } from '../util/types'
import { BadRequestError } from '../errors';

const pollutionRouter = express.Router();

pollutionRouter.get('/', async (req: polutionReq, res) => {

    if (req.query.latitude === undefined){
        throw new BadRequestError('latitude is required')
    }

    if (req.query.longitude === undefined){
        throw new BadRequestError('longitude is required')
    }

    const query = {
        lat: req.query.latitude.toString(),
        lon: req.query.longitude.toString()
    }
    
    res.send({"Result": await getAirQuality(query), status: 'success'});
});

pollutionRouter.get('/maxdate', async (req, res) => {
    res.send({...(await Pollution.maxPollutionTime()), status: 'success'});
});

export default pollutionRouter;