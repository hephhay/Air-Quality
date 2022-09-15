import { URL, URLSearchParams } from 'url';
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

export { pollutionEndpoint };