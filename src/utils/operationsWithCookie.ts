export const getCookieByName = (name: string): string => {
    function escape(s: string): string {
        return s.replace(/([.*+?^${}()|[\]/\\])/g, '\\$1');
    }

    const match: RegExpMatchArray | null = document.cookie.match(
        RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)')
    );
    return match ? match[1] : '';
};

export const setCookie = (
    name: string,
    value: string,
    options: any = {},
    maxAge?: number
): void => {
    options = {
        path: '/',
        ...options,
    };
    let updatedCookie: string = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    // tslint:disable-next-line:forin
    for (const optionKey in options) {
        updatedCookie += '; ' + optionKey;
        const propValue = options[optionKey];
        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }
    if (maxAge) {
        updatedCookie += '; Max-Age=' + maxAge;
    }
    document.cookie = updatedCookie;
};
