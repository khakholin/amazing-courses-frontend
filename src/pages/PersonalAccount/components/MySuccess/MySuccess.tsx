import React, { Fragment } from 'react';

import './mySuccessStyle.scss';

export interface IMySuccessProps { }

const MySuccess = (props: IMySuccessProps) => {
    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Успехи</div>
                <div className="personal-account-info-header__description">Прогресс прохождения курсов</div>
            </div>
            <div className="my-success-component personal-account-info-body">

            </div>
        </Fragment>
    );
};

export default MySuccess;
