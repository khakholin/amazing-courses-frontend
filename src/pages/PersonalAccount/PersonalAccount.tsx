import React, { useEffect, useState, Fragment } from 'react';
import FaceIcon from '@material-ui/icons/Face';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import { endpoints } from '../../constants/endpoints';
import { appRequest } from '../../modules/app/appRequest';
import { IUserProfileResponse } from '../../types/responseTypes';

import './personalAccountStyle.scss';
import Account from './components/Account/Account';
import MyCourses from './components/MyCourses/MyCourses';
import MyProfile from './components/MyProfile/MyProfile';
import MySuccess from './components/MySuccess/MySuccess';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import UserList from './components/UserList/UserList';
import UserInformation from './components/UserInformation/UserInformation';

export interface IPersonalAccount { };

const PersonalAccount = (props: IPersonalAccount) => {
    const [currentMenuItem, setCurrentMenuItem] = useLocalStorage('profileMenuItem', 'MyProfile');
    const [userData, setUserData] = useState<IUserProfileResponse>();
    const [currentUserProfile, setCurrentUserProfile] = useState({});

    useEffect(() => {
        appRequest(endpoints.getProfile, 'GET')
            .then((response: { data: IUserProfileResponse }) => {
                setUserData(response.data)
            });
    }, []);

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
                        userName={userData?.username}
                    />
                )
            case 'MyCourses':
                return (
                    <MyCourses />
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
            default:
                break;
        }
    }

    return (
        <div className="personal-account page-container">
            <div className="personal-account-profile">
                <div className="personal-account-profile__bar">
                    <FaceIcon className="personal-account-profile__avatar" />
                    <div className="personal-account-profile__name">{userData?.username}</div>
                    <div className="personal-account-profile__menu">
                        <li className="personal-account-profile__menu-item" onClick={() => onMenuItemClick('MyProfile')}>
                            <PersonIcon className="personal-account-profile__menu-icon" />
                            <span className="personal-account-profile__menu-title">Мой профиль</span>
                        </li>
                        <li className="personal-account-profile__menu-item" onClick={() => onMenuItemClick('MyCourses')}>
                            <ImportContactsIcon className="personal-account-profile__menu-icon" />
                            <span className="personal-account-profile__menu-title">Мои курсы</span>
                        </li>
                        <li className="personal-account-profile__menu-item" onClick={() => onMenuItemClick('MySuccess')}>
                            <TrendingUpIcon className="personal-account-profile__menu-icon" />
                            <span className="personal-account-profile__menu-title">Мои успехи</span>
                        </li>
                        <li className="personal-account-profile__menu-item" onClick={() => onMenuItemClick('Account')}>
                            <SettingsIcon className="personal-account-profile__menu-icon" />
                            <span className="personal-account-profile__menu-title">Учетная запись</span>
                        </li>
                        {
                            userData?.role === 'admin' ?
                                <li
                                    className="personal-account-profile__menu-item personal-account-profile__menu-item_private"
                                    onClick={() => onMenuItemClick('UserList')}
                                >
                                    <PeopleIcon className="personal-account-profile__menu-icon" />
                                    <span className="personal-account-profile__menu-title">Список пользователей</span>
                                </li>
                                : <Fragment />
                        }
                    </div>
                </div>
                <div className="personal-account-profile__info">
                    {infoForm()}
                </div>
                {/* 
                <div>Адрес электронной почты: {userData?.email}</div>
                <div>Доступные курсы: {userData?.availableCourses.length ? userData?.availableCourses : 'у вас нет доступных курсов'}</div> */}
            </div>
        </div>
    );
};

export default PersonalAccount;
