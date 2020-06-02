import React, { useState, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import BGContent from '../../components/common/BGContent/BGContent';
import InputField from '../../components/common/InputField/InputField';
import ModalComponent from '../../components/common/ModalComponent/ModalComponent';
import { REPLACEABLE_FIELD_NAME, emailRegExp } from '../../constants/common';
import { endpoints } from '../../constants/endpoints';
import * as translation from '../../constants/translation';
import appHistory from '../../modules/app/appHistory';
import { appRequest } from '../../modules/app/appRequest';
import { setCookie } from '../../utils/operationsWithCookie';
import { IResponse } from '../../types/responseTypes';

import './loginStyle.scss';
import { EResponseMessages } from '../../constants/responseMessages';
import Header from '../../components/common/Header/Header';

type TLogin = RouteComponentProps;

const Login = (props: TLogin) => {
    const [confirmPassword, setConfirmPassword] = useState({ value: '', show: false });
    const [confirmPasswordError, setConfirmPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState({ showCheck: false, status: false, text: '' });
    const [forgotPassword, setForgotPassword] = useState(false);
    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState({ showCheck: false, status: false, text: '' });
    const [modalText, setModalText] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState({ value: '', show: false });
    const [passwordError, setPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [registration, setRegistration] = useState(false);

    const clearData = () => {
        setConfirmPassword({ value: '', show: false });
        setConfirmPasswordError({ showCheck: false, status: false, text: '' });
        setEmail('');
        setEmailError({ showCheck: false, status: false, text: '' });
        setUserName('');
        setUserNameError({ showCheck: false, status: false, text: '' });
        setPassword({ value: '', show: false });
        setPasswordError({ showCheck: false, status: false, text: '' });
    }

    const confirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfirmPassword({ ...confirmPassword, value: event.target.value });
        password.value ? (
            event.target.value === password.value ?
                setConfirmPasswordError({ showCheck: true, status: false, text: '' }) :
                setConfirmPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordMismatch })
        ) : setConfirmPasswordError({ showCheck: false, status: false, text: '' })
    };

    const confirmPasswordShowClick = () => {
        setConfirmPassword({ ...confirmPassword, show: !confirmPassword.show });
        const el = document.getElementById('confirm-password-field') as HTMLInputElement;
        el.focus();
        el.selectionStart = confirmPassword.value.length;
    };

    const emailChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(event.target.value);
        if (registration) {
            if (event.target.value.length) {
                if (emailRegExp.test(event.target.value)) {
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
        } else {
            if (event.target.value.length) {
                setEmailError({ showCheck: true, status: false, text: '' });
            } else {
                setEmailError({
                    showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                        .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.email)
                });
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenModal = (text: string, title: string) => {
        setModalText(text);
        setModalTitle(title);
        setOpenModal(true);
        setTimeout(() => {
            handleCloseModal();
        }, 4000)
    };

    const handleRecoveryPassword = () => {
        appRequest('/api/user/recovery', 'POST', { email })
            .then((response: IResponse) => {
                if (response.data) {
                    setForgotPassword(false);
                    handleOpenModal('Ваш пароль успешно выслан на почту', 'Внимание');
                } else {
                    handleOpenModal('Пользователь с таким почтовым ящиком не зарегистрирован', 'Ошибка');
                }
            })
        clearData();
    }

    const handleRegistration = () => {
        appRequest('/api/user/registration', 'POST', { email, username: userName, password: password.value })
            .then((response: IResponse) => {
                if (response.data.status === 201) {
                    setRegistration(false);
                    handleOpenModal('Вы успешно зарегистрированы', 'Внимание');
                } else {
                    if (response.data.message === 'EMAIL_DUPLICATE') {
                        handleOpenModal('Нельзя зарегистрировать несколько пользователей с одним почтовым ящиком', 'Ошибка');
                    }
                    if (response.data.message === 'USER_DUPLICATE') {
                        handleOpenModal('Пользователь с таким именем уже существует', 'Ошибка');
                    }
                }
            })
        clearData();
    }

    const userNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserName(event.target.value.trim());
        if (registration) {
            event.target.value.trim().length ? (
                event.target.value.trim().length < 5 ?
                    setUserNameError({ showCheck: false, status: true, text: translation.defaultTranslation.minimumLoginLength }) :
                    setUserNameError({ showCheck: true, status: false, text: '' })
            ) : setUserNameError({
                showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.userName)
            })
        } else {
            event.target.value.trim().length ? (
                setUserNameError({ showCheck: true, status: false, text: '' })
            ) : setUserNameError({
                showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.userName)
            })
        }
    };

    const onEnterClickHandler = () => {
        appRequest(endpoints.authLogin, 'POST', { username: userName, password: password.value })
            .then((response: IResponse) => {
                const authCookie = response.data?.access_token;
                setCookie('auth', authCookie ? authCookie : '', {}, 900);
                if (response.data.message === EResponseMessages.Unauthorized) {
                    handleOpenModal('Неверный пользователь или пароль', 'Ошибка');
                } else {
                    appHistory.push('/personal-area');
                }
            });
    };

    const passwordComparison = (realPassword: string) => {
        realPassword ? (
            confirmPassword.value === realPassword ?
                setConfirmPasswordError({ showCheck: true, status: false, text: '' }) :
                setConfirmPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordMismatch })
        ) : setConfirmPasswordError({ showCheck: false, status: false, text: '' })
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword({ ...password, value: event.target.value });
        if (registration) {
            if (event.target.value.length) {
                passwordComparison(event.target.value);
                for (let i = 0; i < event.target.value.length; i++) {
                    if (event.target.value[i] === ' ') {
                        setPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordRequirements });
                        return
                    }
                }
                if (event.target.value.length < 5) {
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
        } else {
            if (event.target.value.length) {
                setPasswordError({ showCheck: true, status: false, text: '' });
            } else {
                setPasswordError({
                    showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                        .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.password)
                });
            }
        }
    };

    const passwordShowClick = () => {
        setPassword({ ...password, show: !password.show });
        const el = document.getElementById('password-field') as HTMLInputElement;
        el.focus()
        el.selectionStart = password.value.length;
    };

    return (
        <Fragment>
            <Header login />
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
                            handleChange={emailChange}
                            value={email}
                        />
                        <InputField
                            error={userNameError}
                            field={{
                                name: 'login',
                                title: translation.defaultTranslation.userName,
                                placeholder: translation.defaultTranslation.userNamePlaceholder,
                            }}
                            handleChange={userNameChange}
                            value={userName}
                        />
                        <InputField
                            error={passwordError}
                            field={{
                                name: 'password',
                                title: translation.defaultTranslation.password,
                                placeholder: translation.defaultTranslation.passwordPlaceholder,
                            }}
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
                            handleChange={confirmPasswordChange}
                            passwordShowClick={confirmPasswordShowClick}
                            value={confirmPassword}
                        />
                        <div className="buttons-container_column">
                            {
                                emailError.showCheck && userNameError.showCheck && passwordError.showCheck && confirmPasswordError.showCheck ?
                                    <Button
                                        className="button-primary button-primary_full-width button_column-margin"
                                        variant="outlined"
                                        onClick={() => handleRegistration()}
                                    >
                                        {translation.defaultTranslation.registrationText}
                                    </Button> :
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
                                handleChange={emailChange}
                                value={email}
                            />
                            <div className="buttons-container_column">
                                {
                                    emailError.showCheck ?
                                        <Button
                                            className="button-primary button-primary_full-width button_column-margin"
                                            variant="outlined"
                                            onClick={() => handleRecoveryPassword()}
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
                                        error={userNameError}
                                        field={{
                                            name: 'login',
                                            title: translation.defaultTranslation.userName,
                                            placeholder: translation.defaultTranslation.userNamePlaceholder,
                                        }}
                                        handleChange={userNameChange}
                                        value={userName}
                                    />
                                    <InputField
                                        error={passwordError}
                                        field={{
                                            name: 'password',
                                            title: translation.defaultTranslation.password,
                                            placeholder: translation.defaultTranslation.passwordPlaceholder,
                                        }}
                                        handleChange={passwordChange}
                                        passwordShowClick={passwordShowClick}
                                        value={password}
                                    />
                                    <div className="buttons-container_row">
                                        {
                                            userNameError.showCheck && passwordError.showCheck ?
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
                            </Fragment>
                        )
                }
                <ModalComponent
                    closeHandler={handleCloseModal}
                    error
                    isOpen={openModal}
                    text={modalText}
                    title={modalTitle}
                />
            </div>
        </Fragment>
    );
};

export default (withRouter(Login));
