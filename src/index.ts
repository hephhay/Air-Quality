import { config } from 'dotenv';
import  express  from 'express';
import 'express-async-errors';
import { Server } from 'http';
import { disconnect } from 'mongoose';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

import  connectDB  from './db/index';
import { healthCheckAsync } from './controller/health-check';
import healthRouter from './router/health.route';
import pollutionRouter from './router/airPollution.routes';
import { parisTask } from './tasks';
import  notFound from './middleware/not-found';
// import errorHandler from './middleware/error';
import handleError from './middleware/error-handler';

config();

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 1000,
        max: 10,
    })
);

app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.SECRET));


app.get('/', async (req, res,) => {
    const result = await healthCheckAsync();
    res.send({
        health: result,
        status: 'success'
    });
});

app.use('/health', healthRouter);
app.use('/pollution', pollutionRouter);

app.use(notFound);
app.use(handleError);
// app.use(errorHandlerMiddleware);

const port = process.env?.PORT || 5000;

let server: Server | undefined = undefined;

const start = async (portValue: string | Number) => {
    await connectDB(process.env.MONGO_URI as string);
    console.log('database connected');
    server = app.listen(portValue, () =>{
        console.log(`🚀 Server ready at http://127.0.0.1:${portValue} ...`);; 

        parisTask.start();
        console.log('task started');
    });

};

start(port)

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown (signal: any) {
    if (signal) console.log(`\nReceived signal ${signal}`)
    console.log('Gracefully closing http server');

    if (server?.closeAllConnections) server?.closeAllConnections();

    else setTimeout(() => {
        process.exit(0), 5000;
    });

    try {
        disconnect().then( _ => console.log('Stopping Mongoose connection'));
        console.log('Mongoose connection stopped');

        parisTask.stop();
        console.log('Stopped running task');

        server?.close(function (err: unknown) {
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

export {app, server};