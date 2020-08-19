import React, { Fragment, useEffect, useState } from 'react';
import { CircularProgress, Button } from '@material-ui/core';

import InputField from '../../../../components/common/InputField/InputField';
import ModalComponent from '../../../../components/common/ModalComponent/ModalComponent';
import { emailRegExp, REPLACEABLE_FIELD_NAME } from '../../../../constants/common';
import { defaultTranslation } from '../../../../constants/translation';
import { useLocalStorage } from '../../../../hooks/useLocalStorage';
import { appRequest } from '../../../../modules/app/appRequest';
import { IUserProfileResponse } from '../../../../types/responseTypes';

import './accountStyle.scss';

export interface IAccountProps { }

const Account = (props: IAccountProps) => {
    // eslint-disable-next-line
    const [confirmPassword, setConfirmPassword] = useState({ value: '', show: false });
    const [confirmPasswordError, setConfirmPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState({ showCheck: false, status: false, text: '' });
    // eslint-disable-next-line
    const [initialUserName, setInitialUserName] = useLocalStorage('initialUserName', '');
    const [isLoader, setIsLoader] = useState(true);
    const [modalText, setModalText] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState({ value: '', show: false });
    const [passwordError, setPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [singlePassword, setSinglePassword] = useState({ value: '', show: false });
    const [singlePasswordError, setSinglePasswordError] = useState({ showCheck: false, status: false, text: '' });

    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
        appRequest('/api/user/data', 'POST', { username: initialUserName })
            .then((response: { data: IUserProfileResponse }) => {
                setEmail(response.data.email);
                setEmailError({ showCheck: (response.data.email ? true : false), status: false, text: '' });
            });
        // eslint-disable-next-line
    }, []);

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSinglePassword({ value: '', show: false });
        setSinglePasswordError({ showCheck: false, status: false, text: '' });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSinglePassword({ value: '', show: false });
        setSinglePasswordError({ showCheck: false, status: false, text: '' });
    };

    const emailChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(event.target.value);
        if (event.target.value.length) {
            if (emailRegExp.test(event.target.value)) {
                setEmailError({ showCheck: true, status: false, text: '' });
            } else {
                setEmailError({ showCheck: false, status: true, text: defaultTranslation.emailRequirements });
            }
        } else {
            setEmailError({
                showCheck: false, status: true, text: defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, defaultTranslation.email)
            });
        }
    };

    const onEditClick = () => {
        appRequest('/api/user/data', 'POST', { username: initialUserName })
            .then(response => {
                setEmail(response.data.email);
                setEmailError({ showCheck: (response.data.email ? true : false), status: false, text: '' });
            });

        setSinglePassword({ value: '', show: false });
        setSinglePasswordError({ showCheck: false, status: false, text: '' });
        setPassword({ value: '', show: false });
        setPasswordError({ showCheck: false, status: false, text: '' });
        setConfirmPassword({ value: '', show: false });
        setConfirmPasswordError({ showCheck: false, status: false, text: '' });
        setOpenEditModal(true);
    }

    const onAcceptEmailClick = () => {
        appRequest('/api/user/email-update', 'POST', { username: initialUserName, password: singlePassword.value, newEmail: email })
            .then((response) => {
                if (response.data.status === 403) {
                    setModalText('Неверный пароль');
                    setOpenModal(true);
                    setTimeout(() => {
                        handleCloseModal();
                    }, 4000);
                } else {
                    appRequest('/api/user/data', 'POST', { username: initialUserName })
                        .then((response: { data: IUserProfileResponse }) => {
                            setEmail(response.data.email);
                            setEmailError({ showCheck: (response.data.email ? true : false), status: false, text: '' });
                        });
                    setModalText('Адрес электронной почты успешно изменен');
                    setOpenModal(true);
                    setTimeout(() => {
                        handleCloseModal();
                        setOpenEditModal(false);
                    }, 4000);
                }
            });
    }

    const onAcceptPasswordClick = () => {
        appRequest('/api/user/password-update', 'POST', { username: initialUserName, oldPassword: singlePassword.value, newPassword: password.value })
            .then((response) => {
                if (response.data.status === 403) {
                    setModalText('Неверный пароль');
                    setOpenModal(true);
                    setTimeout(() => {
                        handleCloseModal();
                    }, 4000);
                } else {
                    setSinglePassword({ value: '', show: false });
                    setSinglePasswordError({ showCheck: false, status: false, text: '' });
                    setPassword({ value: '', show: false });
                    setPasswordError({ showCheck: false, status: false, text: '' });
                    setConfirmPassword({ value: '', show: false });
                    setConfirmPasswordError({ showCheck: false, status: false, text: '' });
                    setModalText('Пароль успешно изменен');
                    setOpenModal(true);
                    setTimeout(() => {
                        handleCloseModal();
                    }, 4000);
                }
            });
    }

    const singlePasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSinglePassword({ ...singlePassword, value: event.target.value });
        if (event.target.value.length) {
            for (let i = 0; i < event.target.value.length; i++) {
                if (event.target.value[i] === ' ') {
                    setSinglePasswordError({ showCheck: false, status: true, text: defaultTranslation.passwordRequirements });
                    return
                }
            }
            setSinglePasswordError({ showCheck: true, status: false, text: '' });
        } else {
            setSinglePasswordError({
                showCheck: false, status: true, text: defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, defaultTranslation.password)
            });
        }
    };

    const singlePasswordShowClick = () => {
        setSinglePassword({ ...singlePassword, show: !singlePassword.show });
        const el = document.getElementById('password-field') as HTMLInputElement;
        el.focus();
        el.selectionStart = singlePassword.value.length;
    };

    const confirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfirmPassword({ ...confirmPassword, value: event.target.value });
        password.value ? (
            event.target.value === password.value ?
                setConfirmPasswordError({ showCheck: true, status: false, text: '' }) :
                setConfirmPasswordError({ showCheck: false, status: true, text: defaultTranslation.passwordMismatch })
        ) : setConfirmPasswordError({ showCheck: false, status: false, text: '' })
    };

    const confirmPasswordShowClick = () => {
        setConfirmPassword({ ...confirmPassword, show: !confirmPassword.show });
        const el = document.getElementById('confirm-password-field') as HTMLInputElement;
        el.focus();
        el.selectionStart = confirmPassword.value.length;
    };

    const passwordComparison = (realPassword: string) => {
        realPassword ? (
            confirmPassword.value === realPassword ?
                setConfirmPasswordError({ showCheck: true, status: false, text: '' }) :
                setConfirmPasswordError({ showCheck: false, status: true, text: defaultTranslation.passwordMismatch })
        ) : setConfirmPasswordError({ showCheck: false, status: false, text: '' })
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword({ ...password, value: event.target.value });
        if (event.target.value.length) {
            passwordComparison(event.target.value);
            for (let i = 0; i < event.target.value.length; i++) {
                if (event.target.value[i] === ' ') {
                    setPasswordError({ showCheck: false, status: true, text: defaultTranslation.passwordRequirements });
                    return
                }
            }
            if (event.target.value.length < 5) {
                setPasswordError({ showCheck: false, status: true, text: defaultTranslation.simplePassword });
            } else {
                setPasswordError({ showCheck: true, status: false, text: '' });
            }
        } else {
            setPasswordError({
                showCheck: false, status: true, text: defaultTranslation.requiredField
                    .replace(REPLACEABLE_FIELD_NAME, defaultTranslation.password)
            });
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
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Учетная запись</div>
                <div className="personal-account-info-header__description">Изменение настройки учетной записи и пароля</div>
            </div>
            <div className="account-component personal-account-info-body">
                {
                    isLoader ?
                        <div className="info-form-spinner__wrapper">
                            <CircularProgress
                                className="info-form-spinner__item"
                                size={100}
                                thickness={3}
                            />
                        </div> :
                        <Fragment>
                            <div className="account-component__form">
                                <div className="account-component__form_top">
                                    <InputField
                                        disabled
                                        onEditClick={onEditClick}
                                        error={emailError}
                                        field={{
                                            name: 'email',
                                            title: defaultTranslation.email,
                                            placeholder: defaultTranslation.emailPlaceholder,
                                        }}
                                        handleChange={emailChange}
                                        value={email}
                                    />
                                </div>
                                <div className="account-component__line"></div>
                                <div className="account-component__form_bottom">
                                    <InputField
                                        error={singlePasswordError}
                                        field={{
                                            name: 'password',
                                            title: 'Старый пароль',
                                            placeholder: 'WeakPassword1234',
                                        }}
                                        handleChange={singlePasswordChange}
                                        passwordShowClick={singlePasswordShowClick}
                                        value={singlePassword}
                                    />
                                    <InputField
                                        error={passwordError}
                                        field={{
                                            name: 'password',
                                            title: 'Новый пароль',
                                            placeholder: defaultTranslation.passwordPlaceholder,
                                        }}
                                        handleChange={passwordChange}
                                        passwordShowClick={passwordShowClick}
                                        value={password}
                                    />
                                    <InputField
                                        error={confirmPasswordError}
                                        field={{
                                            name: 'confirm-password',
                                            title: 'Новый пароль еще раз',
                                            placeholder: defaultTranslation.passwordPlaceholder,
                                        }}
                                        handleChange={confirmPasswordChange}
                                        passwordShowClick={confirmPasswordShowClick}
                                        value={confirmPassword}
                                    />
                                    {
                                        (singlePassword.value && !singlePasswordError.status &&
                                            password.value && !passwordError.status &&
                                            confirmPassword.value && !confirmPasswordError.status) ?
                                            <Button
                                                className="button-primary button-primary_full-width"
                                                variant="outlined"
                                                onClick={() => onAcceptPasswordClick()}
                                            >
                                                Изменить пароль
                                            </Button>
                                            :
                                            <Button
                                                disabled
                                                variant="outlined"
                                                className="button-secondary_full-width"
                                            >
                                                Изменить пароль
                                            </Button>
                                    }
                                </div>
                            </div>
                            <ModalComponent
                                closeHandler={handleCloseEditModal}
                                error
                                isOpen={openEditModal}
                                text={''}
                                title={'Изменение адреса электронной почты'}
                            >
                                <div className="account-component-edit-email">
                                    <InputField
                                        error={emailError}
                                        field={{
                                            name: 'email',
                                            title: defaultTranslation.email,
                                            placeholder: defaultTranslation.emailPlaceholder,
                                        }}
                                        handleChange={emailChange}
                                        value={email}
                                    />
                                    <div className="account-component-edit-email__description">Для изменения адреса электронной почты требуется подтверждение паролем</div>
                                    <InputField
                                        error={singlePasswordError}
                                        field={{
                                            name: 'password',
                                            title: 'Текущий пароль',
                                            placeholder: defaultTranslation.passwordPlaceholder,
                                        }}
                                        handleChange={singlePasswordChange}
                                        passwordShowClick={singlePasswordShowClick}
                                        value={singlePassword}
                                    />
                                    {
                                        (singlePassword.value && !singlePasswordError.status) ?
                                            <Button
                                                className="button-primary button-primary_full-width"
                                                variant="outlined"
                                                onClick={() => onAcceptEmailClick()}
                                            >
                                                Изменить
                                            </Button>
                                            :
                                            <Button
                                                disabled
                                                variant="outlined"
                                                className="button-secondary_full-width"
                                            >
                                                Изменить
                                            </Button>
                                    }
                                </div>
                            </ModalComponent>
                            <ModalComponent
                                closeHandler={handleCloseModal}
                                error
                                isOpen={openModal}
                                text={modalText}
                                title={'Внимание'}
                            />
                        </Fragment>
                }
            </div>

        </Fragment>
    );
};

export default Account;
