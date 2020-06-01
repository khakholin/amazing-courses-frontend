import React, { ComponentType, Fragment } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { getCookieByName } from '../utils/operationsWithCookie';

import * as routes from './constants/routesConstants';
import Header from '../components/common/Header/Header';

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
                    <Fragment>
                        <Header />
                        {React.createElement(props.component, { ...routeProps, ...props })}
                    </Fragment>
                    :
                    <Redirect to={routes.LOGIN} />
            } />
    );
};

export default PrivateRoute;
