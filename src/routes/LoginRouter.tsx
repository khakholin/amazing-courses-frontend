import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import { RoutePath } from './constants/routesConstants';

const LoginRouter: FC = () => {
    const isLogin = false;

    if (isLogin) {
        return <Redirect to={RoutePath.personalArea} />;
    } else {
        return <Route component={Login} path={RoutePath.login} exact />;
    }
};

export default LoginRouter;
