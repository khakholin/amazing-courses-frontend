import React, { Fragment, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';

import './studentSuccessStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';

export interface IStudentSuccessProps {
    username?: string;
    roles?: string[];
}

const StudentSuccess = (props: IStudentSuccessProps) => {
    const [isLoader, setIsLoader] = useState(true);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
        appRequest('/api/user/get-students', 'POST', { username: props.username, roles: props.roles })
            .then(response => {
                setUsers(response.data);
            });
    }, [props.username, props.roles]);


    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Успехи учеников</div>
                <div className="personal-account-info-header__description">
                    Прогресс прохождения курсов учениками
                    <br></br>
                    <div className="personal-account-info-header__description_mentor">доступно только учителям</div>
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
                                users.length && users.map((user: any, index: number) => {
                                    return (
                                        <div
                                            className="user-list-component__item"
                                            onClick={() => console.log('click')}
                                        >
                                            {
                                                user.realName || user.realSurname ?
                                                    user.realSurname + ' ' + user.realName :
                                                    user.email
                                            }
                                        </div>
                                    )
                                })
                            }
                        </Fragment>
                }
            </div>
        </Fragment>
    );
};

export default StudentSuccess;
