import React, { FC } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import appHistory from '../modules/app/appHistory';
import PersonalAccount from '../pages/PersonalAccount/PersonalAccount';
import Courses from '../pages/Courses/Courses';

import LoginRouter from './LoginRouter';
import PrivateRoute from './PrivateRoute';
import * as routes from './constants/routesConstants';

const AppRouter: FC = () => {
    return (
        <Router history={appHistory}>
            <Switch>
                <Route exact path="/">
                    <Redirect to={routes.LOGIN} />
                </Route>
                <Route exact path={routes.LOGIN} component={LoginRouter} />
                <PrivateRoute exact path={routes.PERSONAL_ACCOUNT} component={PersonalAccount} />
                <PrivateRoute exact path={routes.COURSES} component={Courses} />
                <Route path="*">
                    <Redirect to={routes.PERSONAL_ACCOUNT} />
                </Route>
            </Switch>
        </Router>
    );
};
export default AppRouter;
