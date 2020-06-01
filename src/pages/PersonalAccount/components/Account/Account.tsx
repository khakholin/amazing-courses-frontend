import React from 'react';

import './accountStyle.scss';

export interface IAccountProps {
    userEmail: string | undefined;
}

const Account = (props: IAccountProps) => {
    return (
        <div className="account-component">
            {props.userEmail}
            <br></br>
            поле для изменения почты (подтверждение с помощью пароля)
            <br></br>
            поля для изменения пароля (текущий и новый 2 раза)
        </div>
    );
};

export default Account;
