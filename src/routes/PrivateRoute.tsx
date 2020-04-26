import React, { ComponentType } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { RoutePath } from './constants/routesConstants';

interface IPrivateRouteProps extends RouteProps {
    component: ComponentType;
}

type Props = IPrivateRouteProps;

const PrivateRoute = (props: Props) => {
    // TODO write how to get token
    const isLogin = true;

    return (
        <Route
            {...props}
            render={(routeProps: any) =>
                (isLogin ?
                    React.createElement(props.component, { ...routeProps, ...props }) :
                    <Redirect to={RoutePath.login} />
                )
            }
        />
    );
};

export default PrivateRoute;
