import React, { useEffect, useState, Fragment } from 'react';

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
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Список пользователей</div>
                <div className="personal-account-info-header__description">
                    Редактирование пользовательских данных
                    <br></br>
                    <span>доступно только администраторам</span>
                </div>
            </div>
            <div className="user-list-component personal-account-info-body">
                {
                    users.length && users.map((user: IUserProfileResponse, index: number) => {
                        return (
                            <div
                                className="user-list-component__item"
                                onClick={() => props.onUserProfileClick(user)}
                            >
                                {user.username}
                            </div>
                        )
                    })
                }
            </div>
        </Fragment>
    );
};

export default UserList;
