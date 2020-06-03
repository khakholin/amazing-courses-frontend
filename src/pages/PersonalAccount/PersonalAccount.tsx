import React, { useEffect, useState, Fragment } from 'react';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import clsx from 'clsx';

import { ReactComponent as Man } from '../../theme/icons/Man.svg';
import { endpoints } from '../../constants/endpoints';
import { appRequest } from '../../modules/app/appRequest';
import { IUserProfileResponse } from '../../types/responseTypes';

import './personalAccountStyle.scss';
import Account from './components/Account/Account';
import MyProfile from './components/MyProfile/MyProfile';
import MySuccess from './components/MySuccess/MySuccess';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import UserList from './components/UserList/UserList';
import UserInformation from './components/UserInformation/UserInformation';
import { getCookieByName } from '../../utils/operationsWithCookie';
import appHistory from '../../modules/app/appHistory';
import CourseList from './components/CourseList/CourseList';

export interface IPersonalAccount { };

const PersonalAccount = (props: IPersonalAccount) => {
    const [currentMenuItem, setCurrentMenuItem] = useLocalStorage('profileMenuItem', 'MyProfile');
    const [userData, setUserData] = useState<IUserProfileResponse>();
    const [currentUserProfile, setCurrentUserProfile] = useState<IUserProfileResponse>();

    useEffect(() => {
        appRequest(endpoints.getProfile, 'GET')
            .then((response: { data: IUserProfileResponse }) => {
                setUserData(response.data)
            });
        if (currentMenuItem === 'UserInformation') {
            setCurrentMenuItem('UserList');
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!getCookieByName('auth')) {
            setCurrentMenuItem('MyProfile')
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
                    <MyProfile
                        realName={userData?.realName}
                        realSurname={userData?.realSurname}
                        school={userData?.school}
                        university={userData?.university}
                        userName={userData?.username}
                        workPlace={userData?.workPlace}
                    />
                )
            case 'MySuccess':
                return (
                    <MySuccess />
                )
            case 'Account':
                return (
                    <Account
                        userEmail={userData?.email}
                    />
                )
            case 'UserList':
                return (
                    <UserList
                        onUserProfileClick={onUserProfileClick}
                    />
                )
            case 'UserInformation':
                return (
                    <UserInformation
                        user={currentUserProfile}
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

    const menuItemClasses = (menuItemName: string, privateItem?: boolean) => {
        const menuItemClass = clsx('personal-account-profile__menu-item', {
            'personal-account-profile__menu-item_active': menuItemName === currentMenuItem,
            'personal-account-profile__menu-item_private': privateItem,
        });
        return menuItemClass;
    }

    return (
        <div className="personal-account page-container">
            <div className="personal-account-profile">
                <div className="personal-account-profile__bar">
                    <Man className="personal-account-profile__avatar" />
                    <div className="personal-account-profile__name">{userData?.username}</div>
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
                            userData?.role === 'admin' ?
                                <Fragment>
                                    <li
                                        className={menuItemClasses('UserList', true)}
                                        onClick={() => onMenuItemClick('UserList')}
                                    >
                                        <PeopleIcon className="personal-account-profile__menu-icon" />
                                        <span className="personal-account-profile__menu-title">Список пользователей</span>
                                    </li>
                                    <li
                                        className={menuItemClasses('CourseList', true)}
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
            </div>
        </div>
    );
};

export default PersonalAccount;
