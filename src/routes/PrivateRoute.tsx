import React, { ComponentType } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { getCookieByName } from '../utils/operationsWithCookie';

import { RoutePath } from './constants/routesConstants';

interface IPrivateRouteProps extends RouteProps {
    component: ComponentType;
}

type Props = IPrivateRouteProps;

const PrivateRoute = (props: Props) => {
    const token = getCookieByName('auth');

    return (
        <Route
            render={(routeProps: any) =>
                token && Object.keys(token).length ?
                    React.createElement(props.component, { ...routeProps, ...props })
                    :
                    <Redirect to={RoutePath.login} />
            } />
    );
};

export default PrivateRoute;
