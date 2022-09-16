import { URL, URLSearchParams } from 'url';
import fetch from 'node-fetch';

import { location } from '../util/types';

function pollutionEndpoint(query: location) {
    const url = new URL(process.env?.AIR_VISUAL as string);

    var params = {
        ...query,
        key: process.env?.IQAIR_SECRET_KEY as string
    }

    url.search = new URLSearchParams(params).toString();

    return url.href
}

async function queryPollution(url: string){

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    return response.json();
}

export { pollutionEndpoint, queryPollution };