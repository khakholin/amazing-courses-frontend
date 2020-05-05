import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';

import Login from '../pages/Login/Login';
import { getCookieByName } from '../utils/operationsWithCookie';

import { RoutePath } from './constants/routesConstants';

const LoginRouter: FC = () => {
    // const token = getCookieByName('auth');

    // if (token && Object.keys(token).length) {
    //     return <Redirect to={RoutePath.personalArea} />;
    // } else {
    //     return <Route component={Login} path={RoutePath.login} exact />;
    // }

    const isLogin = false;

    if (isLogin) {
        return <Redirect to={RoutePath.personalArea} />;
    } else {
        return <Route component={Login} path={RoutePath.login} exact />;
    }
};

export default LoginRouter;
