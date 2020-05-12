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
    let updatedCookie: string =
        encodeURIComponent(name) + '=' + encodeURIComponent(value);

    // tslint:disable-next-line:forin
    for (const optionKey in options) {
        updatedCookie += '; ' + optionKey + ';Max-Age=' + maxAge;
        if (maxAge) {
            updatedCookie += '; ' + optionKey + ';Max-Age=' + maxAge;
        } else {
            updatedCookie += '; ' + optionKey;
        }
        const optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }
    document.cookie = updatedCookie;
};

export const removeCookie = (name: string) => {
    setCookie(name, '', { 'max-age': -1 });
};
