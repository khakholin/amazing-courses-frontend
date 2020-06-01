import { EResponseMessages } from "../constants/responseMessages";

export interface IResponseData {
    message: EResponseMessages;
    status: number;
    access_token?: string;
}

export interface IResponse {
    data: IResponseData;
}

export interface IUserProfileResponse {
    _id?: string;
    username: string;
    email: string;
    role: string;
    availableCourses: Array<string>;
}
