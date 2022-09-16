import  express  from 'express';
import 'express-async-errors';

import { healthCheckAsync, healthCheckSync } from '../controller/health-check';

const healthRouter = express.Router();

healthRouter.get('/sync', (req, res) => {
    const result = healthCheckSync();
    res.json({
        health: result,
        status: 'success'
    });
});

healthRouter.get('/async', async (req, res) => {
    const result = await healthCheckAsync();
    res.json({
        health: result,
        status: 'success'
    });
});


export default healthRouter;