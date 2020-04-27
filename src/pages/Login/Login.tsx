import React from 'react';
import { translate, TranslateProps } from 'react-polyglot';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import BGContent from '../../components/common/BGContent/BGContent';
import * as routes from '../../routes/constants/routesConstants';

import './loginStyle.scss';
import LoginField from '../../components/common/LoginField/LoginField';
import PasswordField from '../../components/common/PasswordField/PasswordField';

type TLogin = TranslateProps & RouteComponentProps;

const Login = (props: TLogin) => {
    return (
        <div className="login">
            <BGContent
                title='Вход'
            >
                <LoginField />
                <PasswordField />
            </BGContent>

            {/* <Link to={routes.RoutePath.personalArea}>
                <Button
                    className="login__button-reports"
                    variant="outlined"
                >
                    личный кабинет
                </Button>
            </Link> */}
        </div>
    );
};

export default translate()(withRouter(Login));
