import React from 'react';

import './userInformationStyle.scss';

export interface IUserInformationProps {
    user: any;
}

const UserInformation = (props: IUserInformationProps) => {
    return (
        <div className="user-information-component">
            ИНФОРМАЦИЯ ПО ПОЛЬЗОВАТЕЛЮ: {props.user.username}
            <br></br>
            КУРСЫ ПОЛЬЗОВАТЕЛЯ: {props.user.availableCourses}
        </div>
    );
};

export default UserInformation;
