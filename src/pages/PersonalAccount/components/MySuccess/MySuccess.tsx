import React, { Fragment, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';

import './mySuccessStyle.scss';

export interface IMySuccessProps { }

const MySuccess = (props: IMySuccessProps) => {
    const [isLoader, setIsLoader] = useState(true);
    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
    }, []);
    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Успехи</div>
                <div className="personal-account-info-header__description">Прогресс прохождения курсов</div>
            </div>
            <div className="my-success-component personal-account-info-body">
                {
                    isLoader ?
                        <div className="info-form-spinner__wrapper">
                            <CircularProgress
                                className="info-form-spinner__item"
                                size={100}
                                thickness={3}
                            />
                        </div>
                        :
                        <div>ИНФОРМАЦИЯ НЕДОСТУПНА</div>
                }
            </div>
        </Fragment>
    );
};

export default MySuccess;
