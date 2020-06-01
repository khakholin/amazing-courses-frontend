import React from 'react';

import './myProfileStyle.scss';

export interface IMyProfileProps {
    userName: string | undefined;
}

const MyProfile = (props: IMyProfileProps) => {
    return (
        <div className="my-profile-component">
            {props.userName}
            <br></br>
            возможен ввод более полных данных (фамилия, место учебы), на будущее: загрузка фото
        </div>
    );
};

export default MyProfile;
