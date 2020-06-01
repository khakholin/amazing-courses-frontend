import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';

import Login from '../pages/Login/Login';
import { getCookieByName } from '../utils/operationsWithCookie';

import * as routes from './constants/routesConstants';

const LoginRouter: FC = () => {
    const token = getCookieByName('auth');

    if (token && Object.keys(token).length) {
        return <Redirect to={routes.PERSONAL_ACCOUNT} />;
    } else {
        return <Route component={Login} path={routes.LOGIN} exact />;
    }
};

export default LoginRouter;
