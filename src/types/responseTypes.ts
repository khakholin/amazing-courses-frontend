import { EResponseMessages } from "../constants/responseMessages";

export interface IResponseData {
    message: EResponseMessages;
    status: number;
    access_token?: string;
}

export interface IResponse {
    data: IResponseData;
}