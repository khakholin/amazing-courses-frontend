import React from 'react';

import './myProfileStyle.scss';

export interface IMyProfileProps {
    realName: string | undefined;
    realSurname: string | undefined;
    school: string | undefined;
    university: string | undefined;
    userName: string | undefined;
    workPlace: string | undefined;
}

const MyProfile = (props: IMyProfileProps) => {
    return (
        <div className="my-profile-component">
            Логин: {props.userName}
            <br></br>
            Имя: {props.realName}
            <br></br>
            Фамилия: {props.realSurname}
            <br></br>
            Школа: {props.school}
            <br></br>
            Университет: {props.university}
            <br></br>
            Место работы: {props.workPlace}
        </div>
    );
};

export default MyProfile;
