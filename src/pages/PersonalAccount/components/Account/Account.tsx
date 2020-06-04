import React, { Fragment, useEffect, useState } from 'react';

import './accountStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';
import { IUserProfileResponse } from '../../../../types/responseTypes';
import { useLocalStorage } from '../../../../hooks/useLocalStorage';
import { CircularProgress } from '@material-ui/core';

export interface IAccountProps { }

const Account = (props: IAccountProps) => {
    // eslint-disable-next-line
    const [initialUserName, setInitialUserName] = useLocalStorage('initialUserName', '');
    const [userEmail, setUserEmail] = useState('');
    const [isLoader, setIsLoader] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoader(false), 1000);
        appRequest('/api/user/data', 'POST', { username: initialUserName })
            .then((response: { data: IUserProfileResponse }) => {
                setUserEmail(response.data.email);
            });
        // eslint-disable-next-line
    }, []);
    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Учетная запись</div>
                <div className="personal-account-info-header__description">Изменение настройки учетной записи и пароля</div>
            </div>
            <div className="account-component personal-account-info-body">
                {
                    isLoader ?
                        <div className="info-form-spinner__wrapper">
                            <CircularProgress
                                className="info-form-spinner__item"
                                size={100}
                                thickness={3}
                            />
                        </div> :
                        <Fragment>
                            {userEmail}
                            <br></br>
                            поле для изменения почты (подтверждение с помощью пароля)
            <br></br>
                            поля для изменения пароля (текущий и новый 2 раза)
                </Fragment>
                }
            </div>

        </Fragment>
    );
};

export default Account;
