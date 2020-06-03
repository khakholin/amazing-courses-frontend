import React, { Fragment } from 'react';

import './accountStyle.scss';

export interface IAccountProps {
    userEmail: string | undefined;
}

const Account = (props: IAccountProps) => {
    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Учетная запись</div>
                <div className="personal-account-info-header__description">Изменение настройки учетной записи и пароля</div>
            </div>
            <div className="account-component personal-account-info-body">
                {props.userEmail}
                <br></br>
                поле для изменения почты (подтверждение с помощью пароля)
            <br></br>
                поля для изменения пароля (текущий и новый 2 раза)
        </div>

        </Fragment>
    );
};

export default Account;
