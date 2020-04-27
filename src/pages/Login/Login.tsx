import React, { useState, Fragment } from 'react';
import { translate, TranslateProps } from 'react-polyglot';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import BGContent from '../../components/common/BGContent/BGContent';
import * as routes from '../../routes/constants/routesConstants';

import './loginStyle.scss';
import LoginField from '../../components/common/LoginField/LoginField';
import PasswordField from '../../components/common/PasswordField/PasswordField';
import EmailField from '../../components/common/EmailField/EmailField';
import ConfirmPasswordField from '../../components/common/ConfirmPasswordField/ConfirmPasswordField';

type TLogin = TranslateProps & RouteComponentProps;

const Login = (props: TLogin) => {
    const [registration, setRegistration] = useState(false);

    return (
        <div className="login">
            {registration ?
                <BGContent
                    title='Регистрация'
                >
                    <EmailField />
                    <LoginField />
                    <PasswordField />
                    <ConfirmPasswordField />
                    <div className="buttons-container_column">
                        <Button className="button-primary button_column-margin" variant="outlined">Зарегистрироваться</Button>
                        <Button
                            className="button-secondary"
                            variant="outlined"
                            onClick={event => setRegistration(false)}
                        >
                            Есть аккаунт
                            </Button>
                    </div>
                </BGContent>
                :
                <Fragment>
                    <BGContent
                        title='Вход'
                    >
                        <LoginField />
                        <PasswordField />
                        <div className="buttons-container_row">
                            <Link to={routes.RoutePath.personalArea}>
                                <Button className="button-primary" variant="outlined">Войти</Button>
                            </Link>
                            <div className="button-text">Забыли пароль?</div>
                        </div>
                    </BGContent>
                    <div className="login-registration">
                        <BGContent
                            title='Впервые у нас?'
                        >
                            <div className="buttons-container_row">
                                <Button
                                    className="button-secondary button-secondary_full-width"
                                    variant="outlined"
                                    onClick={event => setRegistration(true)}
                                >
                                    Зарегистрироваться
                                </Button>
                            </div>
                        </BGContent>
                    </div>
                </Fragment>
            }
        </div>
    );
};

export default translate()(withRouter(Login));
