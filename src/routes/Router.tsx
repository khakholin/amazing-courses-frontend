import React, { FC } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import appHistory from '../modules/app/appHistory';
import PersonalArea from '../pages/PersonalArea/PersonalAreaLoadable';

import LoginRouter from './LoginRouter';
import PrivateRoute from './PrivateRoute';
import { RoutePath } from './constants/routesConstants';

const AppRouter: FC = () => {
    return (
        <Router history={appHistory}>
            <Switch>
                <Route exact path="/">
                    <Redirect to={RoutePath.login} />
                </Route>
                <Route exact path={RoutePath.login} component={LoginRouter} />
                <PrivateRoute exact path={RoutePath.personalArea} component={PersonalArea} />
                <Route path="*">
                    <Redirect to={RoutePath.personalArea} />
                </Route>
            </Switch>
        </Router>
    );
};
export default AppRouter;
