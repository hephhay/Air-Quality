import  express  from 'express';
import 'express-async-errors';
import Pollution from '../model';

import { getAirQuality } from '../controller/air-quality';
import { polutionReq } from '../util/types'

const pollutionRouter = express.Router();

pollutionRouter.get('/', async (req: polutionReq, res) => {
    const query = {
        lat: req.query.latitude.toString(),
        lon: req.query.longitude.toString()
    }
    
    res.send({"Result": await getAirQuality(query), status: 200});
});

pollutionRouter.get('/maxdate', async (req, res) => {
    res.send({...(await Pollution.maxPollutionTime()), status: 200});
});

export default pollutionRouter;