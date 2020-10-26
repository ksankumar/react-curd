/**
 * index.js Created by sandy on 1/31/2020
 */
class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}
const options = {
    method: 'POST',
    // body: JSON.stringify(myPost),
    headers: {
        'Content-Type': 'application/json'
    }
}
class RestApi {
    async get (url) {
        let response = await fetch(url);
        if (response.status === 200) {
            return response.json();
        } else {
            throw new HttpError(response);
        }
    }
}

export default new RestApi()
