import React, { useEffect, useState, Fragment } from 'react';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import clsx from 'clsx';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import appHistory from '../../modules/app/appHistory';
import { appRequest, appRequestFile, appRequestFile2 } from '../../modules/app/appRequest';
import { IUserProfileResponse } from '../../types/responseTypes';
import PublishIcon from '@material-ui/icons/Publish';
import { getCookieByName } from '../../utils/operationsWithCookie';

import Account from './components/Account/Account';
import CourseList from './components/CourseList/CourseList';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import MyProfile from './components/MyProfile/MyProfile';
import MySuccess from './components/MySuccess/MySuccess';
import UserInformation from './components/UserInformation/UserInformation';
import UserList from './components/UserList/UserList';
import './personalAccountStyle.scss';
import StudentSuccess from './components/StudentSuccess/StudentSuccess';
import { CircularProgress } from '@material-ui/core';
import ModalComponent from '../../components/common/ModalComponent/ModalComponent';

export interface IPersonalAccount { };

const PersonalAccount = (props: IPersonalAccount) => {
    // eslint-disable-next-line
    const [initialEmail, setInitialEmail] = useLocalStorage('initialEmail', '');
    const [currentMenuItem, setCurrentMenuItem] = useLocalStorage('profileMenuItem', 'MyProfile');
    const [userData, setUserData] = useState<IUserProfileResponse>();
    const [currentUserProfile, setCurrentUserProfile] = useState<IUserProfileResponse>();
    const [isLoader, setIsLoader] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
        appRequest('/api/user/data', 'POST', { email: initialEmail })
            .then((response: { data: IUserProfileResponse }) => {
                setUserData(response.data)
            });
        if (currentMenuItem === 'UserInformation') {
            setCurrentMenuItem('UserList');
        }
        appRequestFile2('/api/user/get-image', 'GET')
            .then((avatar) => {
                if (avatar.data.message !== 'USER_IMAGE_NOT_FOUND') {
                    let reader = new FileReader();
                    let file = avatar.data;

                    reader.onloadend = () => {
                        setCurrentAvatar(reader.result);
                    }

                    reader.readAsDataURL(file);
                }
            })
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!getCookieByName('auth')) {
            setCurrentMenuItem('MyProfile');
            setInitialEmail('');
            appHistory.push('/login');
        }
        // eslint-disable-next-line
    }, [getCookieByName('auth')])

    const onMenuItemClick = (menuItemName: string) => {
        setCurrentMenuItem(menuItemName);
    }

    const onUserProfileClick = (user: IUserProfileResponse) => {
        setCurrentUserProfile(user);
        setCurrentMenuItem('UserInformation');
    }

    const infoForm = () => {
        switch (currentMenuItem) {
            case 'MyProfile':
                return (
                    <MyProfile />
                )
            case 'MySuccess':
                return (
                    <MySuccess />
                )
            case 'Account':
                return (
                    <Account />
                )
            case 'UserList':
                return (
                    <UserList
                        onUserProfileClick={onUserProfileClick}
                    />
                )
            case 'StudentSuccess':
                return (
                    <StudentSuccess
                        email={userData?.email}
                        roles={userData?.roles}
                    />
                )
            case 'UserInformation':
                return (
                    <UserInformation
                        currentUser={currentUserProfile?.email}
                    />
                )
            case 'CourseList':
                return (
                    <CourseList />
                )
            default:
                break;
        }
    }

    const menuItemClasses = (menuItemName: string, mentorItem?: boolean, privateItem?: boolean) => {
        const menuItemClass = clsx('personal-account-profile__menu-item', {
            'personal-account-profile__menu-item_active': menuItemName === currentMenuItem,
            'personal-account-profile__menu-item_mentor': mentorItem,
            'personal-account-profile__menu-item_private': privateItem,
        });
        return menuItemClass;
    }

    const [image, setImage] = useState<any>('');
    const [imageError, setImageError] = useState<string>('');
    const [currentAvatar, setCurrentAvatar] = useState<any>();
    const [isUploadModalShown, setIsUploadModalShown] = useState<boolean>(false);

    const handleImageChange = (event: any) => {
        event.preventDefault();

        if (event.target.files.length) {


            let reader = new FileReader();
            let file = event.target.files[0];

            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                if (file.size < 1000000) {
                    setImageError('')
                    reader.onloadend = () => {
                        setImage(file);
                        const btn: HTMLButtonElement | null = document.querySelector('.personal-account__submit-button');
                        btn?.click();
                    }

                    reader.readAsDataURL(file);
                } else {
                    setImage('');
                    setImageError('Слишком большой размер файла');
                }
            } else {
                setImage('');
                setImageError('Неверный формат файла')
            }
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        appRequestFile('/api/user/load-image', 'POST', image)
            .then((response) => {
                if (response.data) {
                    setImage('');
                    setImageError('');
                    const a: HTMLFormElement | null = document.querySelector('.personal-account__avatar-form');
                    a?.reset();
                    appRequestFile2('/api/user/get-image', 'GET')
                        .then((avatar) => {
                            if (avatar) {
                                let reader = new FileReader();
                                let file = avatar.data;

                                reader.onloadend = () => {
                                    setCurrentAvatar(reader.result);
                                    setIsUploadModalShown(false);
                                }

                                reader.readAsDataURL(file);

                            }
                        })
                }
            });
    }

    const handleCloseUploadModal = () => {
        setIsUploadModalShown(false);
    }

    return (
        <div className="personal-account page-container">
            {
                isLoader ?
                    <div className="info-form-spinner__wrapper personal-account__loader">
                        <CircularProgress
                            className="info-form-spinner__item "
                            size={100}
                            thickness={3}
                        />
                    </div> :
                    <div className="personal-account-profile">
                        <div className="personal-account-profile__bar">
                            <img className="personal-account-profile__avatar" src={currentAvatar} alt="" />
                            <div className="personal-account-profile-upload" onClick={() => setIsUploadModalShown(true)}>
                                {currentAvatar ?
                                    <PublishIcon className="personal-account-profile-upload__icon" /> :
                                    <PhotoCameraIcon className="personal-account-profile-upload__icon" />
                                }
                                <span className="personal-account-profile-upload__text">{currentAvatar ? 'Обновить фотографию' : 'Загрузить фотографию'}</span>
                            </div>
                            <div className="personal-account-profile__name">{userData && (userData?.realName + ' ' + userData?.realSurname)}</div>
                            <div className="personal-account-profile__menu">
                                <li className={menuItemClasses('MyProfile')} onClick={() => onMenuItemClick('MyProfile')}>
                                    <PersonIcon className="personal-account-profile__menu-icon" />
                                    <span className="personal-account-profile__menu-title">Мой профиль</span>
                                </li>
                                <li className={menuItemClasses('MyCourses')} onClick={() => appHistory.push('/courses')}>
                                    <ImportContactsIcon className="personal-account-profile__menu-icon" />
                                    <span className="personal-account-profile__menu-title">Мои курсы</span>
                                </li>
                                <li className={menuItemClasses('MySuccess')} onClick={() => onMenuItemClick('MySuccess')}>
                                    <TrendingUpIcon className="personal-account-profile__menu-icon" />
                                    <span className="personal-account-profile__menu-title">Мои успехи</span>
                                </li>
                                <li className={menuItemClasses('Account')} onClick={() => onMenuItemClick('Account')}>
                                    <SettingsIcon className="personal-account-profile__menu-icon" />
                                    <span className="personal-account-profile__menu-title">Учетная запись</span>
                                </li>
                                {
                                    userData?.roles?.find(role => role === 'mentor') ?
                                        <Fragment>
                                            <li
                                                className={menuItemClasses('StudentSuccess', true)}
                                                onClick={() => onMenuItemClick('StudentSuccess')}
                                            >
                                                <TrendingUpIcon className="personal-account-profile__menu-icon" />
                                                <span className="personal-account-profile__menu-title">Успехи учеников</span>
                                            </li>
                                        </Fragment>
                                        : <Fragment />
                                }
                                {
                                    userData?.roles?.find(role => role === 'admin') ?
                                        <Fragment>
                                            <li
                                                className={menuItemClasses('UserList', false, true)}
                                                onClick={() => onMenuItemClick('UserList')}
                                            >
                                                <PeopleIcon className="personal-account-profile__menu-icon" />
                                                <span className="personal-account-profile__menu-title">Список пользователей</span>
                                            </li>
                                            <li
                                                className={menuItemClasses('CourseList', false, true)}
                                                onClick={() => onMenuItemClick('CourseList')}
                                            >
                                                <MenuBookIcon className="personal-account-profile__menu-icon" />
                                                <span className="personal-account-profile__menu-title">Список курсов</span>
                                            </li>
                                        </Fragment>
                                        : <Fragment />
                                }
                            </div>
                        </div>
                        <div className="personal-account-profile__info">
                            {infoForm()}
                        </div>
                        {
                            isUploadModalShown ?
                                <ModalComponent
                                    closeHandler={handleCloseUploadModal}
                                    error
                                    isOpen={isUploadModalShown}
                                    text={''}
                                    title={'Загрузка новой фотографии'}
                                >
                                    <div className="personal-account-profile-modal">
                                        <div className="personal-account-profile-modal__title">
                                            Пользователям будет проще узнать Вас, если Вы загрузите свою настоящую фотографию.
                                            Вы можете загрузить изображение в формате JPG или PNG.
                                        </div>
                                        <form
                                            className="personal-account__avatar-form"
                                        >
                                            <label>
                                                <div className="personal-account__button button-primary">
                                                    Выбрать файл
                                                </div>
                                                <input
                                                    style={{ display: "none" }}
                                                    className="personal-account__avatar-input"
                                                    type="file"
                                                    onChange={(e) => handleImageChange(e)}
                                                />
                                            </label>
                                            <button
                                                className="personal-account__submit-button"
                                                onClick={(e) => handleSubmit(e)}
                                            >
                                            </button>
                                        </form>
                                        <div className="personal-account-profile__avatar-error">{imageError}</div>

                                        <div className="personal-account-profile-modal__info">
                                            Если у Вас возникают проблемы с загрузкой, попробуйте выбрать фотографию меньшего размера.
                                        </div>
                                    </div>
                                </ModalComponent>
                                : <Fragment />
                        }
                    </div>
            }
        </div>
    );
};

export default PersonalAccount;
