import { schedule } from 'node-cron';

import { paris } from '../util/constants';
import { Pollution } from '../model';
import { getAirQuality } from '../controller/air-quality';

const parisTask = schedule('* * * * *', async () =>  {
    const data = new Pollution(await getAirQuality(paris));

    const newData = await data.save();

        console.log(`new data saved with id ${newData._id}`);
    }, {
        scheduled: false
    }
);

export { parisTask }
