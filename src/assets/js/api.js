"use strict";
import { loadConfig } from "./config.js";
let api = null;


function getStations(successHandler) {
    return get("stations", successHandler);
}


function get(uri, successHandler = logJson, failureHandler = logError) {
    if (api === null) {
        loadConfig(a => {
            api = a;
            get(uri, successHandler, failureHandler);
        });
        return;
    }

    const request = new Request(api + uri, {
        method: 'GET',
    });

    call(request, successHandler, failureHandler);
}

function post(uri, body, successHandler = logJson, failureHandler = logError) {
    if (api === null) {
        loadConfig(a => {
            api = a;
            post(uri, body, successHandler, failureHandler);
        });
        return;
    }

    const request = new Request(api + uri, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    });

    call(request, successHandler, failureHandler);
}

function put(uri, body, successHandler = logJson, failureHandler = logError) {
    if (api === null) {
        loadConfig(a => {
            api = a;
            put(uri, body, successHandler, failureHandler);
        });
        return;
    }

    const request = new Request(api + uri, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;'
        },
        body: JSON.stringify(body)
    });

    call(request, successHandler, failureHandler);
}

function remove(uri, successHandler = logJson, failureHandler = logError) {
    if (api === null) {
        loadConfig(a => {
            api = a;
            remove(uri, successHandler, failureHandler);
        });
        return;
    }

    const request = new Request(api + uri, {
        method: 'DELETE',
    });

    call(request, successHandler, failureHandler);
}

function logJson(response) {
    response.json().then(console.log);
}

function logError(error) {
    console.log(error);
}

function call(request, successHandler, errorHandler) {
    fetch(request).then(successHandler).catch(errorHandler);
}


export { getStations };
