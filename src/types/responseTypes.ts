import { EResponseMessages } from "../constants/responseMessages";

export interface IResponseData {
    message: EResponseMessages;
    status: number;
    access_token?: string;
}

export interface IResponse {
    data: IResponseData;
}
export interface ICourseProgress {
    courseName: string;
    numAvailableLectures: number;
    numCheckedLectures: number;
}

export interface IUserProfileResponse {
    availableCourses: string[];
    _id?: string;
    courseProgress: IUserCourseProgress[];
    email: string;
    realName: string;
    realSurname: string;
    role: string;
    school: string;
    university: string;
    username: string;
    workPlace: string;
}

export interface IUserCourseProgress {
    _id?: string;
    availableLectures: number[];
    checkedLectures: number[];
    courseName: string;
}