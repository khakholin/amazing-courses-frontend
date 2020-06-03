import React, { useState, useEffect, Fragment } from 'react';

import InputField from '../../../../components/common/InputField/InputField';
import * as translation from '../../../../constants/translation';

import './myProfileStyle.scss';
import { Button } from '@material-ui/core';

export interface IMyProfileProps {
    realName: string | undefined;
    realSurname: string | undefined;
    school: string | undefined;
    university: string | undefined;
    userName: string | undefined;
    workPlace: string | undefined;
}

const MyProfile = (props: IMyProfileProps) => {
    useEffect(() => {
        if (props.realName) {
            setRealName(props.realName)
            setRealNameError({ ...realNameError, showCheck: true, status: false })
        }
        if (props.realSurname) {
            setRealSurname(props.realSurname)
            setRealSurnameError({ ...realSurnameError, showCheck: true, status: false })
        }
        if (props.school) {
            setSchool(props.school)
            setSchoolError({ ...schoolError, showCheck: true, status: false })
        }
        if (props.university) {
            setUniversity(props.university)
            setUniversityError({ ...universityError, showCheck: true, status: false })
        }
        if (props.userName) {
            setUserName(props.userName)
            setUserNameError({ ...userNameError, showCheck: true, status: false })
        }
        if (props.workPlace) {
            setWorkPlace(props.workPlace)
            setWorkPlaceError({ ...workPlaceError, showCheck: true, status: false })
        }
        // eslint-disable-next-line
    }, [props])
    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState({ showCheck: false, status: false, text: '' });
    const [realName, setRealName] = useState('');
    const [realNameError, setRealNameError] = useState({ showCheck: false, status: false, text: '' });
    const [realSurname, setRealSurname] = useState('');
    const [realSurnameError, setRealSurnameError] = useState({ showCheck: false, status: false, text: '' });
    const [school, setSchool] = useState('');
    const [schoolError, setSchoolError] = useState({ showCheck: false, status: false, text: '' });
    const [university, setUniversity] = useState('');
    const [universityError, setUniversityError] = useState({ showCheck: false, status: false, text: '' });
    const [workPlace, setWorkPlace] = useState('');
    const [workPlaceError, setWorkPlaceError] = useState({ showCheck: false, status: false, text: '' });

    const userNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserName(event.target.value.trim());
        // if (registration) {
        //     event.target.value.trim().length ? (
        //         event.target.value.trim().length < 5 ?
        //             setUserNameError({ showCheck: false, status: true, text: translation.defaultTranslation.minimumLoginLength }) :
        //             setUserNameError({ showCheck: true, status: false, text: '' })
        //     ) : setUserNameError({
        //         showCheck: false, status: true, text: translation.defaultTranslation.requiredField
        //             .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.userName)
        //     })
        // } else {
        //     event.target.value.trim().length ? (
        //         setUserNameError({ showCheck: true, status: false, text: '' })
        //     ) : setUserNameError({
        //         showCheck: false, status: true, text: translation.defaultTranslation.requiredField
        //             .replace(REPLACEABLE_FIELD_NAME, translation.defaultTranslation.userName)
        //     })
        // }
    };

    const realNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRealName(event.target.value.trim());
    };

    const realSurnameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRealSurname(event.target.value.trim());
    };
    const schoolChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSchool(event.target.value);
    };
    const universityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUniversity(event.target.value);
    };
    const workPlaceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setWorkPlace(event.target.value);
    };

    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Профиль</div>
                <div className="personal-account-info-header__description">Добавьте информацию о себе</div>
            </div>
            <div className="my-profile-component personal-account-info-body">
                <div className="my-profile-component__form">
                    <InputField
                        error={userNameError}
                        field={{
                            name: 'userName',
                            title: translation.defaultTranslation.userName,
                            placeholder: translation.defaultTranslation.userNamePlaceholder,
                        }}
                        handleChange={userNameChange}
                        value={userName}
                    />
                    <InputField
                        error={realNameError}
                        field={{
                            name: 'realName',
                            title: 'Имя',
                            placeholder: 'Евкакий',
                        }}
                        handleChange={realNameChange}
                        value={realName}
                    />
                    <InputField
                        error={realSurnameError}
                        field={{
                            name: 'realSurname',
                            title: 'Фамилия',
                            placeholder: 'Премудрый',
                        }}
                        handleChange={realSurnameChange}
                        value={realSurname}
                    />
                    <InputField
                        error={schoolError}
                        field={{
                            name: 'school',
                            title: 'Школа',
                            placeholder: 'Гимназия №4',
                        }}
                        handleChange={schoolChange}
                        value={school}
                    />
                    <InputField
                        error={universityError}
                        field={{
                            name: 'university',
                            title: 'Университет',
                            placeholder: 'Стэнфорд',
                        }}
                        handleChange={universityChange}
                        value={university}
                    />
                    <InputField
                        error={workPlaceError}
                        field={{
                            name: 'workPlace',
                            title: 'Место работы',
                            placeholder: 'Facebook',
                        }}
                        handleChange={workPlaceChange}
                        value={workPlace}
                    />
                    <Button
                        className="button-primary button-primary_full-width"
                        variant="outlined"
                        onClick={() => console.log('click')}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </Fragment>
    );
};

export default MyProfile;
