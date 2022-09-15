import { config } from 'dotenv';
import  express  from 'express';
import 'express-async-errors';
import { Request } from 'express';
import { URL, URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { schedule } from 'node-cron';
import { Server } from 'http';
import  connectDB  from './db/index'
import { disconnect } from 'mongoose';
import Pollution from './model/index';

config();

type polutionReq = Request<{}, {}, {}, {longitude: number,latitude: number}>

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    const data = new Pollution({
        ts: '2022-09-15T09:00:00.000Z',
        aqius: 64,
        mainus: 'p2',
        aqicn: 26,
        maincn: 'p2'
    });
    await data.save();

    res.send(data);
});

app.get('/puppy', async (req, res) => {
    res.send(await Pollution.maxPollutionTime())
});

async function polutionEndpoint(query: {lat:string, lon: string}){
    const url = new URL(process.env?.AIR_VISUAL as string);

    var params = {
        ...query,
        key: process.env?.IQAIR_SECRET_KEY as string
    }

    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.href, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    interface reqRes{
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
    }

    const result = (await response.json()) as reqRes;
    return result.data.current.pollution
}

app.get('/polution', async (req: polutionReq, res) => {
    const query = {
        lat: req.query.latitude.toString(),
        lon: req.query.longitude.toString()
    }
    
    res.send({"Result": await polutionEndpoint(query)});
});

const paris = {
    lon: '2.352222',
    lat: '48.856613'
}

const task = schedule('* * * * *', async () =>  {
    const data = new Pollution(await polutionEndpoint(paris));

    await data.save();

        console.log(data);
    }, {
        scheduled: false
    }
);

const port = process.env?.PORT || 5000;

let server: Server;

const start = async (portValue: string | Number) => {
    await connectDB(process.env.MONGO_URI as string);
    console.log('database connected');
    server = app.listen(portValue, () =>{
        console.log(`🚀 Server ready at http://127.0.0.1:${portValue} ...`);
        task.start();
        console.log('task started');
    });
};

start(port)


process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

function gracefulShutdown (signal: any) {
    if (signal) console.log(`\nReceived signal ${signal}`)
    console.log('Gracefully closing http server');

    // closeAllConnections() is only available from Node v18.02
    if (server.closeAllConnections) server.closeAllConnections();

    else setTimeout(() => {
        process.exit(0), 5000;
    });

    try {
        console.log('closing mongoose connection')
        disconnect().then(_ => console.log('Stopping Mongoose connection'));
        task.stop();

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