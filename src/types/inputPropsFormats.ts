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
    time: number;
}

export interface IUserData {
    user: string;
    totalNumOfLectures: number;
    totalTime: number;
    data: ICourseData[];
}

export interface ICourseData {
    title: string;
    numOfLectures: number;
    time: number;
    lectures: ILectureData[];
}

export interface ILectureData {
    available: boolean;
    checked: boolean;
    title: string;
    time: number;
}