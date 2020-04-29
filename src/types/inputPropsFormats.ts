export interface IErrorFormat {
    showCheck: boolean;
    status: boolean;
    text: string;
}

export interface IFieldFormat {
    name: string;
    title: string;
    placeholder: string;
}

export interface IPasswordFormat {
    value: string;
    show: boolean;
}

export interface IDropdownListItem {
    available: boolean;
    checked: boolean;
    title: string;
    time: string;
}