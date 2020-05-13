import React, { useState, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import BGContent from '../../components/common/BGContent/BGContent';
import InputField from '../../components/common/InputField/InputField';
import ModalComponent from '../../components/common/ModalComponent/ModalComponent';
import { REPLACEABLE_FIELD_NAME, emailRegExp } from '../../constants/common';
import { endpoints } from '../../constants/endpoints';
import * as translation from '../../constants/translation';
import appHistory from '../../modules/app/appHistory';
import { appRequest } from '../../modules/app/appRequest';
import * as routes from '../../routes/constants/routesConstants';
import { setCookie } from '../../utils/operationsWithCookie';

import './loginStyle.scss';

type TLogin = RouteComponentProps;

const Login = (props: TLogin) => {

    const [confirmPassword, setConfirmPassword] = useState({ value: '', show: false });
    const [confirmPasswordError, setConfirmPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState({ showCheck: false, status: false, text: '' });
    const [forgotPassword, setForgotPassword] = useState(false);
    const [login, setLogin] = useState('');
    const [loginError, setLoginError] = useState({ showCheck: false, status: false, text: '' });
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState({ value: '', show: false });
    const [passwordError, setPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [registration, setRegistration] = useState(false);

    const clearData = () => {
        setConfirmPassword({ value: '', show: false });
        setConfirmPasswordError({ showCheck: false, status: false, text: '' });
        setEmail('');
        setEmailError({ showCheck: false, status: false, text: '' });
        setLogin('');
        setLoginError({ showCheck: false, status: false, text: '' });
        setPassword({ value: '', show: false });
        setPasswordError({ showCheck: false, status: false, text: '' });
    }

    const confirmPasswordBlur = () => {
        password.value ? (
            confirmPassword.value === password.value ?
                setConfirmPasswordError({ showCheck: true, status: false, text: '' }) :
                setConfirmPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordMismatch })
        ) : setConfirmPasswordError({ showCheck: false, status: false, text: '' })
    }

    const confirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfirmPasswordError({ showCheck: false, status: false, text: '' });
        setConfirmPassword({ ...confirmPassword, value: event.target.value });
    };

    const confirmPasswordShowClick = () => {
        setConfirmPassword({ ...confirmPassword, show: !confirmPassword.show });
        const el = document.getElementById('confirm-password-field') as HTMLInputElement;
        el.focus();
        el.selectionStart = confirmPassword.value.length;
    };

    const emailBlur = () => {
        if (email.length) {
            if (emailRegExp.test(email)) {
                setEmailError({ showCheck: true, status: false, text: '' });
            } else {
                setEmailError({ showCheck: false, status: true, text: translation.defaultTranslation.emailRequirements });
            }
        } else {
            setEmailError({
                showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.email)
            });
        }
    }

    const emailChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmailError({ showCheck: false, status: false, text: '' });
        setEmail(event.target.value);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
        setTimeout(() => {
            handleCloseModal();
        }, 2000)
    };

    const loginBlur = () => {
        login.length ? (
            login.length < 5 ?
                setLoginError({ showCheck: false, status: true, text: translation.defaultTranslation.minimumLoginLength }) :
                setLoginError({ showCheck: true, status: false, text: '' })
        ) : setLoginError({
            showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.login)
        })
    }

    const loginChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLoginError({ showCheck: false, status: false, text: '' });
        setLogin(event.target.value);
    };

    const onEnterClickHandler = () => {
        appRequest(endpoints.authLogin, 'POST', { username: login, password: password.value })
            .then((response) => {
                const authCookie = response.data?.access_token;
                setCookie('auth', authCookie ? authCookie : '', {}, 300);
                if (response.data.message === 'Unauthorized') {
                    handleOpenModal();
                } else {
                    appHistory.push('/personal-area');
                }
            });
    };

    const passwordBlur = () => {
        if (password.value.length) {
            confirmPasswordBlur();
            for (let i = 0; i < password.value.length; i++) {
                if (password.value[i] === ' ') {
                    setPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordRequirements });
                    return
                }
            }
            if (password.value.length < 5) {
                setPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.simplePassword });
            } else {
                setPasswordError({ showCheck: true, status: false, text: '' });
            }
        } else {
            setPasswordError({
                showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.password)
            });
        }
    }

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPasswordError({ showCheck: false, status: false, text: '' });
        setPassword({ ...password, value: event.target.value });
    };


    const passwordShowClick = () => {
        setPassword({ ...password, show: !password.show });
        const el = document.getElementById('password-field') as HTMLInputElement;
        el.focus()
        el.selectionStart = password.value.length;
    };

    return (
        <div className="login page-container">
            {registration ?
                <BGContent
                    title={translation.defaultTranslation.registrationTitle}
                >
                    <InputField
                        error={emailError}
                        field={{
                            name: 'email',
                            title: translation.defaultTranslation.email,
                            placeholder: translation.defaultTranslation.emailPlaceholder,
                        }}
                        handleBlur={emailBlur}
                        handleChange={emailChange}
                        value={email}
                    />
                    <InputField
                        error={loginError}
                        field={{
                            name: 'login',
                            title: translation.defaultTranslation.login,
                            placeholder: translation.defaultTranslation.loginPlaceholder,
                        }}
                        handleBlur={loginBlur}
                        handleChange={loginChange}
                        value={login}
                    />
                    <InputField
                        error={passwordError}
                        field={{
                            name: 'password',
                            title: translation.defaultTranslation.password,
                            placeholder: translation.defaultTranslation.passwordPlaceholder,
                        }}
                        handleBlur={passwordBlur}
                        handleChange={passwordChange}
                        passwordShowClick={passwordShowClick}
                        value={password}
                    />
                    <InputField
                        error={confirmPasswordError}
                        field={{
                            name: 'confirm-password',
                            title: translation.defaultTranslation.passwordAgain,
                            placeholder: translation.defaultTranslation.passwordPlaceholder,
                        }}
                        handleBlur={confirmPasswordBlur}
                        handleChange={confirmPasswordChange}
                        passwordShowClick={confirmPasswordShowClick}
                        value={confirmPassword}
                    />
                    <div className="buttons-container_column">
                        {
                            emailError.showCheck && loginError.showCheck && passwordError.showCheck && confirmPasswordError.showCheck ?
                                <Link to={routes.RoutePath.personalArea}>
                                    <Button
                                        className="button-primary button-primary_full-width button_column-margin"
                                        variant="outlined"
                                    >
                                        {translation.defaultTranslation.registrationText}
                                    </Button>
                                </Link> :
                                <Button
                                    className="button_column-margin"
                                    disabled
                                    variant="outlined"
                                >
                                    {translation.defaultTranslation.registrationText}
                                </Button>
                        }
                        <Button
                            className="button-secondary button-secondary_full-width"
                            variant="outlined"
                            onClick={() => {
                                clearData();
                                setRegistration(false);
                            }}
                        >
                            {translation.defaultTranslation.haveAccountText}
                        </Button>
                    </div>
                </BGContent>
                : forgotPassword ?
                    <BGContent
                        title={translation.defaultTranslation.passwordRecovery}
                    >
                        <InputField
                            error={emailError}
                            field={{
                                name: 'email',
                                title: translation.defaultTranslation.email,
                                placeholder: translation.defaultTranslation.emailPlaceholder,
                            }}
                            handleBlur={emailBlur}
                            handleChange={emailChange}
                            value={email}
                        />
                        <div className="buttons-container_column">
                            {
                                emailError.showCheck ?
                                    <Button
                                        className="button-primary button-primary_full-width button_column-margin"
                                        variant="outlined"
                                        onClick={() => {
                                            clearData();
                                            setForgotPassword(false);
                                        }}
                                    >
                                        {translation.defaultTranslation.sendPasswordToEmail}
                                    </Button> :
                                    <Button
                                        className="button_column-margin"
                                        disabled
                                        variant="outlined"
                                    >
                                        {translation.defaultTranslation.sendPasswordToEmail}
                                    </Button>
                            }
                            <Button
                                className="button-secondary button-secondary_full-width"
                                variant="outlined"
                                onClick={() => {
                                    clearData();
                                    setForgotPassword(false);
                                }}
                            >
                                {translation.defaultTranslation.rememberPassword}
                            </Button>
                        </div>
                    </BGContent>
                    : (
                        <Fragment>
                            <BGContent
                                title={translation.defaultTranslation.enterTitle}
                            >
                                <InputField
                                    error={loginError}
                                    field={{
                                        name: 'login',
                                        title: translation.defaultTranslation.login,
                                        placeholder: translation.defaultTranslation.loginPlaceholder,
                                    }}
                                    handleBlur={loginBlur}
                                    handleChange={loginChange}
                                    value={login}
                                />
                                <InputField
                                    error={passwordError}
                                    field={{
                                        name: 'password',
                                        title: translation.defaultTranslation.password,
                                        placeholder: translation.defaultTranslation.passwordPlaceholder,
                                    }}
                                    handleBlur={passwordBlur}
                                    handleChange={passwordChange}
                                    passwordShowClick={passwordShowClick}
                                    value={password}
                                />
                                <div className="buttons-container_row">
                                    {
                                        loginError.showCheck && passwordError.showCheck ?
                                            <Button
                                                className="button-primary"
                                                variant="outlined"
                                                onClick={() => onEnterClickHandler()}
                                            >
                                                {translation.defaultTranslation.enterText}
                                            </Button>
                                            :
                                            <Button
                                                disabled
                                                variant="outlined"
                                            >
                                                {translation.defaultTranslation.enterText}
                                            </Button>
                                    }
                                    <div
                                        className="button-text"
                                        onClick={() => {
                                            clearData();
                                            setForgotPassword(true);
                                        }}
                                    >
                                        {translation.defaultTranslation.forgotPassword}
                                    </div>
                                </div>
                            </BGContent>
                            <div className="login-registration">
                                <BGContent
                                    title={translation.defaultTranslation.firstTimeWithUs}
                                >
                                    <div className="buttons-container_row">
                                        <Button
                                            className="button-secondary button-secondary_full-width"
                                            onClick={() => {
                                                clearData();
                                                setRegistration(true);
                                            }}
                                            variant="outlined"
                                        >
                                            {translation.defaultTranslation.registrationText}
                                        </Button>
                                    </div>
                                </BGContent>
                            </div>
                        </Fragment>
                    )
            }
            <ModalComponent
                closeHandler={handleCloseModal}
                error
                isOpen={openModal}
                text='Неверный пользователь или пароль'
                title='Ошибка'
            />
        </div>
    );
};

export default (withRouter(Login));
