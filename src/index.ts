import { config } from 'dotenv';
import  express  from 'express';
import 'express-async-errors';
import { Request } from 'express';
import { Server } from 'http';
import { disconnect } from 'mongoose';

import  connectDB  from './db/index';
import { healthCheckAsync } from './controller/health-check';
import healthRouter from './router/health.route';
import pollutionRouter from './router/airPollution.routes';
import { parisTask } from './tasks'

config();

type polutionReq = Request<{}, {}, {}, {longitude: number,latitude: number}>

const app = express();

app.use(express.json());


app.get('/', async (req, res) => {
    res.send(healthCheckAsync);
});

app.use('/health', healthRouter);
app.use('/pollution', pollutionRouter);

const port = process.env?.PORT || 5000;

let server: Server;

const start = async (portValue: string | Number) => {
    await connectDB(process.env.MONGO_URI as string);
    console.log('database connected');
    server = app.listen(portValue, () =>{
        console.log(`🚀 Server ready at http://127.0.0.1:${portValue} ...`);
        parisTask.start();
        console.log('task started');
    });
};

start(port)


process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

function gracefulShutdown (signal: any) {
    if (signal) console.log(`\nReceived signal ${signal}`)
    console.log('Gracefully closing http server');

    if (server.closeAllConnections) server.closeAllConnections();

    else setTimeout(() => {
        process.exit(0), 5000;
    });

    try {
        disconnect().then(_ => console.log('Stopping Mongoose connection'));
        parisTask.stop();

        server.close(function (err) {
        if (err) {
            console.error('There was an error', err);
            process.exit(1);
        } else {
            console.log('http server closed successfully. Exiting!');
            process.exit(0);
        }
        })
    } catch (err) {
        console.error('There was an error', err);
        setTimeout(() => process.exit(1), 500);
    }
}