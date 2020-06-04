import React, { Fragment, useEffect, useState } from 'react';

import './accountStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';
import { IUserProfileResponse } from '../../../../types/responseTypes';
import { useLocalStorage } from '../../../../hooks/useLocalStorage';
import { CircularProgress, Button } from '@material-ui/core';
import InputField from '../../../../components/common/InputField/InputField';
import { defaultTranslation } from '../../../../constants/translation';
import { emailRegExp, REPLACEABLE_FIELD_NAME } from '../../../../constants/common';
import ModalComponent from '../../../../components/common/ModalComponent/ModalComponent';

export interface IAccountProps { }

const Account = (props: IAccountProps) => {
    // eslint-disable-next-line
    const [initialUserName, setInitialUserName] = useLocalStorage('initialUserName', '');
    const [isLoader, setIsLoader] = useState(true);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState({ showCheck: false, status: false, text: '' });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState({ value: '', show: false });
    const [passwordError, setPasswordError] = useState({ showCheck: false, status: false, text: '' });
    const [modalText, setModalText] = useState('');

    useEffect(() => {
        setTimeout(() => setIsLoader(false), 1000);
        appRequest('/api/user/data', 'POST', { username: initialUserName })
            .then((response: { data: IUserProfileResponse }) => {
                setEmail(response.data.email);
                setEmailError({ showCheck: (response.data.email ? true : false), status: false, text: '' });
            });
        // eslint-disable-next-line
    }, []);

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setPassword({ value: '', show: false });
        setPasswordError({ showCheck: false, status: false, text: '' });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenEditModal(false);
        setPassword({ value: '', show: false });
        setPasswordError({ showCheck: false, status: false, text: '' });
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
        setOpenEditModal(true);
    }

    const onAcceptEmailClick = () => {
        appRequest('/api/user/email-update', 'POST', { username: initialUserName, password: password.value, newEmail: email })
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
                    }, 4000);
                }
            });
    }

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword({ ...password, value: event.target.value });
        if (event.target.value.length) {
            for (let i = 0; i < event.target.value.length; i++) {
                if (event.target.value[i] === ' ') {
                    setPasswordError({ showCheck: false, status: true, text: defaultTranslation.passwordRequirements });
                    return
                }
            }
            setPasswordError({ showCheck: true, status: false, text: '' });
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
                                        error={passwordError}
                                        field={{
                                            name: 'password',
                                            title: defaultTranslation.password,
                                            placeholder: defaultTranslation.passwordPlaceholder,
                                        }}
                                        handleChange={passwordChange}
                                        passwordShowClick={passwordShowClick}
                                        value={password}
                                    />
                                    {
                                        (password.value && !passwordError.status) ?
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
