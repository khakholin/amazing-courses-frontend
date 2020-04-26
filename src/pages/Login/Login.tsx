import React from 'react';
import { translate, TranslateProps } from 'react-polyglot';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import * as routes from '../../routes/constants/routesConstants';

import './loginStyle.scss';

type TLogin = TranslateProps & RouteComponentProps;

const Login = (props: TLogin) => {
    return (
        <div className="login">
            <Link to={routes.RoutePath.personalArea}>
                <Button
                    className="login__button-reports"
                    variant="outlined"
                >
                    личный кабинет
                </Button>
            </Link>
        </div>
    );
};

export default translate()(withRouter(Login));
