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

    defaultOptions = { ...defaultOptions, ...options };

    const headers = defaultOptions.headers?.['Content-Type'] ?? '';

    if (body) {
        defaultOptions.body = headers.includes('json')
            ? JSON.stringify(body)
            : body;
    }

    if (options?.token) {
        console.log(options.token);
        defaultOptions.headers['Authorization'] = `Bearer ${options.token}`
    }

    return fetch('http://localhost:3001' + endpoint, defaultOptions)
        .then((resp) => resp.json())
        .then((data) => {
            return {
                data
            };
        })
        .catch((error: any) => {
            throw error;
        });
};
