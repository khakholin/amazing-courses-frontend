import React, { useEffect, useState } from 'react';

import './userListStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';
import { endpoints } from '../../../../constants/endpoints';
import { IUserProfileResponse } from '../../../../types/responseTypes';

export interface IUserListProps {
    onUserProfileClick: (user: IUserProfileResponse) => void;
}

const UserList = (props: IUserListProps) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        appRequest(endpoints.getAllUsers, 'GET')
            .then((response) => {
                setUsers(response.data);
            });
    }, []);

    return (
        <div className="user-list-component">
            {
                users.length && users.map((user: any, index: number) => {
                    return (
                        <div
                            className="user-list-component__item"
                            onClick={() => props.onUserProfileClick(user)}
                        >
                            {index + '. ' + user.username}
                        </div>
                    )
                })
            }
        </div>
    );
};

export default UserList;
