import { schedule } from 'node-cron';

import { paris } from '../util/types';
import Pollution from '../model';
import { getAirQuality } from '../controller/air-quality';

const parisTask = schedule('* * * * *', async () =>  {
    const data = new Pollution(await getAirQuality(paris));

    await data.save();

        console.log(data);
    }, {
        scheduled: false
    }
);

export { parisTask }