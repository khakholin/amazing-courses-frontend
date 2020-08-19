import React, { useEffect, useState, Fragment } from 'react';
import { CircularProgress } from '@material-ui/core';

import { endpoints } from '../../../../constants/endpoints';
import { appRequest } from '../../../../modules/app/appRequest';
import { IUserProfileResponse } from '../../../../types/responseTypes';

import './userListStyle.scss';

export interface IUserListProps {
    onUserProfileClick: (user: IUserProfileResponse) => void;
}

const UserList = (props: IUserListProps) => {
    const [users, setUsers] = useState([]);
    const [isLoader, setIsLoader] = useState(true);
    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
        appRequest(endpoints.getAllUsers, 'GET')
            .then((response) => {
                console.log(response);

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
                    isLoader ?
                        <div className="info-form-spinner__wrapper">
                            <CircularProgress
                                className="info-form-spinner__item"
                                size={100}
                                thickness={3}
                            /></div> :
                        <Fragment>
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
                        </Fragment>
                }
            </div>
        </Fragment >
    );
};

export default UserList;
