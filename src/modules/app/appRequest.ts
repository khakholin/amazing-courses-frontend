import { getCookieByName, removeCookie } from "../../utils/operationsWithCookie";
import { RoutePath } from "../../routes/constants/routesConstants";

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

    return fetch('http://localhost:3001' + endpoint, defaultOptions)
        .then((resp) => resp.json())
        .then((data) => {
            return {
                data
            };
        })
        .catch((error: any) => {
            if (error?.status === 401) {
                removeCookie('auth');
                window.open(RoutePath.login, '_self');
            }
            throw error;
        });
};
