import React, { useState, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import BGContent from '../../components/common/BGContent/BGContent';
import Header from '../../components/common/Header/Header';
import InputField from '../../components/common/InputField/InputField';
import ModalComponent from '../../components/common/ModalComponent/ModalComponent';
import { REPLACEABLE_FIELD_NAME, emailRegExp, textRusRealNameRegExp } from '../../constants/common';
import { endpoints } from '../../constants/endpoints';
import { EResponseMessages } from '../../constants/responseMessages';
import * as translation from '../../constants/translation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import appHistory from '../../modules/app/appHistory';
import { appRequest } from '../../modules/app/appRequest';
import { setCookie } from '../../utils/operationsWithCookie';
import { IResponse } from '../../types/responseTypes';

import './loginStyle.scss';

type TLogin = RouteComponentProps;

const Login = (props: TLogin) => {
    // eslint-disable-next-line
    const [initialEmail, setInitialEmail] = useLocalStorage('initialEmail', '');
    // eslint-disable-next-line
    const [currentMenuItem, setCurrentMenuItem] = useLocalStorage('profileMenuItem', 'MyProfile');
    const [confirmPassword, setConfirmPassword] = useState({ value: '', show: false });
    const [confirmPasswordError, setConfirmPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState({ showCheck: false, status: false, text: '' });
    const [forgotPassword, setForgotPassword] = useState(false);
    const [realName, setRealName] = useState('');
    const [realNameError, setRealNameError] = useState({ showCheck: false, status: false, text: '' });
    const [realSurname, setRealSurname] = useState('');
    const [realSurnameError, setRealSurnameError] = useState({ showCheck: false, status: false, text: '' });
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
        setRealName('');
        setRealNameError({ showCheck: false, status: false, text: '' });
        setRealSurname('');
        setRealSurnameError({ showCheck: false, status: false, text: '' });
        setPassword({ value: '', show: false });
        setPasswordError({ showCheck: false, status: false, text: '' });
    }

    const emptyFieldHandler = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        if (!event.target.value) {
            switch (field) {
                case 'email':
                    setEmailError({
                        showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                            .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.email)
                    });
                    break;
                case 'realName':
                    setRealNameError({
                        showCheck: false, status: true, text: 'Имя обязательно для заполнения'
                    });
                    break;
                case 'realSurname':
                    setRealSurnameError({
                        showCheck: false, status: true, text: 'Фамилия обязательна для заполнения'
                    });
                    break;
                case 'password':
                    setPasswordError({
                        showCheck: false, status: true, text: translation.defaultTranslation.requiredField
                            .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.password)
                    });
                    break;
                default:
                    break;
            }
        }
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
        if (emailError.showCheck &&
            realNameError.showCheck &&
            realSurnameError.showCheck &&
            passwordError.showCheck &&
            confirmPasswordError.showCheck) {
            appRequest('/api/user/registration', 'POST',
                {
                    password: password.value,
                    email: email.toLowerCase(),
                    availableCourses: [],
                    courseProgress: [],
                    realName: realName,
                    realSurname: realSurname,
                    roles: ['user'],
                    school: '',
                    university: '',
                    workPlace: '',
                }
            )
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
    }

    const realNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRealName(event.target.value.trim());

        if (event.target.value.trim().length) {
            for (let i = 0; i < event.target.value.trim().length; i++) {
                if (event.target.value[i] === ' ') {
                    setRealNameError({ showCheck: false, status: true, text: 'Имя может состоять из букв криллицы и не должно содержать пробелы' });
                    return
                }
            }
            if (!textRusRealNameRegExp.test(event.target.value)) {
                setRealNameError({ showCheck: false, status: true, text: 'Имя может состоять из букв криллицы и не должно содержать пробелы' });
            } else {
                if (event.target.value.trim().length < 1) {
                    setRealNameError({ showCheck: false, status: true, text: 'Минимальная длина имени - 1 символ' })
                } else {
                    setRealNameError({ showCheck: true, status: false, text: '' })
                }
            }
        } else {
            setRealNameError({
                showCheck: false, status: true, text: 'Имя обязательно для заполнения'
            })
        }
    }

    const realSurnameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRealSurname(event.target.value.trim());

        if (event.target.value.trim().length) {
            for (let i = 0; i < event.target.value.trim().length; i++) {
                if (event.target.value[i] === ' ') {
                    setRealSurnameError({ showCheck: false, status: true, text: 'Фамилия может состоять из букв криллицы, знака тире и не должна содержать пробелы' });
                    return
                }
            }
            if (!textRusRealNameRegExp.test(event.target.value)) {
                setRealSurnameError({ showCheck: false, status: true, text: 'Логин должен состоять из букв латинского алфавита и не должна содержать пробелы' });
            } else {
                if (event.target.value.trim().length < 1) {
                    setRealSurnameError({ showCheck: false, status: true, text: 'Минимальная длина фамилии - 1 символ' })
                } else {
                    setRealSurnameError({ showCheck: true, status: false, text: '' })
                }
            }
        } else {
            setRealSurnameError({
                showCheck: false, status: true, text: 'Фамилия обязательна для заполнения'
            })
        }
    }

    const onEnterClickHandler = () => {
        appRequest(endpoints.authLogin, 'POST', { username: email, password: password.value })
            .then((response: IResponse) => {
                const authCookie = response.data?.access_token;
                setCookie('auth', authCookie ? authCookie : '', {}, 604800);
                if (response.data.message === EResponseMessages.Unauthorized) {
                    handleOpenModal('Неверный пользователь или пароль', 'Ошибка');
                } else {
                    setInitialEmail(email);
                    appHistory.push('/personal-area');
                }
            });
    };

    const passwordComparison = (realPassword: string) => {
        confirmPassword.value === realPassword ?
            setConfirmPasswordError({ showCheck: true, status: false, text: '' }) :
            setConfirmPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordMismatch })
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword({ ...password, value: event.target.value });
        if (registration) {
            passwordComparison(event.target.value);
            if (event.target.value.length) {
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
                for (let i = 0; i < event.target.value.length; i++) {
                    if (event.target.value[i] === ' ') {
                        setPasswordError({ showCheck: false, status: true, text: translation.defaultTranslation.passwordRequirements });
                        return
                    }
                }
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
                            enterClick={handleRegistration}
                            error={emailError}
                            field={{
                                name: 'email',
                                title: translation.defaultTranslation.email,
                                placeholder: translation.defaultTranslation.emailPlaceholder,
                            }}
                            handleBlur={(event: any) => emptyFieldHandler(event, 'email')}
                            handleChange={emailChange}
                            value={email}
                        />
                        <InputField
                            enterClick={handleRegistration}
                            error={realNameError}
                            field={{
                                name: 'realName',
                                title: 'Имя',
                                placeholder: 'Евкакий',
                            }}
                            handleBlur={(event: any) => emptyFieldHandler(event, 'realName')}
                            handleChange={realNameChange}
                            value={realName}
                        />
                        <InputField
                            enterClick={handleRegistration}
                            error={realSurnameError}
                            field={{
                                name: 'realSurname',
                                title: 'Фамилия',
                                placeholder: 'Премудрый',
                            }}
                            handleBlur={(event: any) => emptyFieldHandler(event, 'realSurname')}
                            handleChange={realSurnameChange}
                            value={realSurname}
                        />
                        <InputField
                            enterClick={handleRegistration}
                            error={passwordError}
                            field={{
                                name: 'password',
                                title: translation.defaultTranslation.password,
                                placeholder: translation.defaultTranslation.passwordPlaceholder,
                            }}
                            handleBlur={(event: any) => emptyFieldHandler(event, 'password')}
                            handleChange={passwordChange}
                            passwordShowClick={passwordShowClick}
                            value={password}
                        />
                        <InputField
                            enterClick={handleRegistration}
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
                                emailError.showCheck &&
                                    realNameError.showCheck &&
                                    realSurnameError.showCheck &&
                                    passwordError.showCheck && confirmPasswordError.showCheck ?
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
                                enterClick={handleRecoveryPassword}
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
                                        enterClick={emailError.showCheck && passwordError.showCheck ? onEnterClickHandler : null}
                                        error={emailError}
                                        field={{
                                            name: 'email',
                                            title: translation.defaultTranslation.email,
                                            placeholder: translation.defaultTranslation.emailPlaceholder,
                                        }}
                                        handleChange={emailChange}
                                        value={email}
                                    />
                                    {/* <InputField
                                        enterClick={userNameError.showCheck && passwordError.showCheck ? onEnterClickHandler : null}
                                        error={emailError}
                                        field={{
                                            name: 'login',
                                            title: translation.defaultTranslation.userName,
                                            placeholder: translation.defaultTranslation.userNamePlaceholder,
                                        }}
                                        handleChange={userNameChange}
                                        value={userName}
                                    /> */}
                                    <InputField
                                        enterClick={emailError.showCheck && passwordError.showCheck ? onEnterClickHandler : null}
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
                                            emailError.showCheck && passwordError.showCheck ?
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
