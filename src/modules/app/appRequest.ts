import { getCookieByName, removeCookie } from "../../utils/operationsWithCookie";
import * as routes from "../../routes/constants/routesConstants";
import { API_URL } from "../../constants/endpoints";

export const appRequest = (endpoint: string, method: string, body?: any, options?: any, ): Promise<any> => {
    let defaultOptions: any = {
        method,
        headers: {
            'X-Request-Source': 'SITE',
            'Content-Type': 'application/json',
            Pragma: 'no-cache',
        },
        mode: 'cors',
    };
    const authToken = getCookieByName('auth');

    defaultOptions = { ...defaultOptions, ...options };

    const headers = defaultOptions.headers?.['Content-Type'] ?? '';

    if (body) {
        defaultOptions.body = headers.includes('json')
            ? JSON.stringify(body)
            : body;
    }

    if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`
    }

    return fetch(API_URL + endpoint, defaultOptions)
        .then((resp) => resp.json())
        .then((data) => {
            return {
                data
            };
        })
        .catch((error: any) => {
            if (error?.status === 401) {
                removeCookie('auth');
                window.open(routes.LOGIN, '_self');
            }
            throw error;
        });
};

export const appRequestFile = (endpoint: string, method: string, body?: any, options?: any, ): Promise<any> => {
    let defaultOptions: any = {
        method,
        headers: {
            'X-Request-Source': 'SITE',
            Pragma: 'no-cache',
        },
        mode: 'cors',
    };
    const authToken = getCookieByName('auth');

    defaultOptions = { ...defaultOptions, ...options };

    // const headers = defaultOptions.headers?.['Content-Type'] ?? '';

    // if (body) {
    //     defaultOptions.body = headers.includes('json')
    //         ? JSON.stringify(body)
    //         : body;
    // }
    let formData = new FormData();

    if (body) {
        formData.append('userImage', body, 'myfile.jpg')
    }

    if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`
    }

    return fetch(API_URL + endpoint, { ...defaultOptions, body: formData })
        .then((resp) => resp.blob())
        .then((data) => {
            return {
                data
            };
        })
        .catch((error: any) => {
            if (error?.status === 401) {
                removeCookie('auth');
                window.open(routes.LOGIN, '_self');
            }
            throw error;
        });
};
