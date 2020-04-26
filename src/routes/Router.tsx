import React, { FC } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import appHistory from '../modules/app/appHistory';
import PersonalArea from '../pages/PersonalArea/PersonalArea';
import { RoutePath } from './constants/routesConstants';
import LoginRouter from './LoginRouter';
import PrivateRoute from './PrivateRoute';

const AppRouter: FC = () => {
    return (
        <Router history={appHistory}>
            <Switch>
                <Route path={RoutePath.login} component={LoginRouter} />
                <PrivateRoute exact path={RoutePath.personalArea} component={PersonalArea} />
                <Route path="**">
                    <Redirect to={RoutePath.login} />
                </Route>
            </Switch>
        </Router>
    );
};
export default AppRouter;
