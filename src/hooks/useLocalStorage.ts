import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: any): any[] {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item: string | null = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    const setValue = (value: any): void => {
        try {
            const valueToStore =
                value instanceof Function
                    ? value(storedValue)
                    : typeof value === 'object'
                        ? getTrimedValue(value)
                        : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
        }
    };

    const getTrimedValue = (value: any): any => {
        const newValue = { ...value };
        Object.entries(newValue).forEach((item: any) => {
            if (typeof item[1] === 'string') {
                newValue[item[0]] = item[1].trim();
            }
        });
        return newValue;
    };

    return [storedValue, setValue];
}
