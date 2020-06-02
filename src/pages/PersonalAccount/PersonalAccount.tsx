import React, { useEffect, useState, Fragment } from 'react';
import FaceIcon from '@material-ui/icons/Face';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import clsx from 'clsx';

import { endpoints } from '../../constants/endpoints';
import { appRequest, appRequest2 } from '../../modules/app/appRequest';
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
    const [currentUserProfile, setCurrentUserProfile] = useState<IUserProfileResponse>();
    const [videoTest, setVideoTest] = useState();

    useEffect(() => {
        appRequest(endpoints.getProfile, 'GET')
            .then((response: { data: IUserProfileResponse }) => {
                setUserData(response.data)
            });

        const createVideo = (result: any) => {
            setVideoTest(result)
        }
        appRequest2('/api/course/video/React/1', 'GET')
            .then(response => {
                console.log(response);

                const reader = new FileReader()
                reader.readAsDataURL(response.data);
                reader.onload = (event: any) => {
                    const result = event?.target.result;
                    createVideo(result);
                }

            });
        // appRequest('/api/course/create', 'POST', testCourse)
        //     .then((response) => {
        //         console.log(response);

        //     });
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
                        realName={userData?.realName}
                        realSurname={userData?.realSurname}
                        school={userData?.school}
                        university={userData?.university}
                        userName={userData?.username}
                        workPlace={userData?.workPlace}
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
                    <FaceIcon className="personal-account-profile__avatar" />
                    <div className="personal-account-profile__name">{userData?.username}</div>
                    <div className="personal-account-profile__menu">
                        <li className={menuItemClasses('MyProfile')} onClick={() => onMenuItemClick('MyProfile')}>
                            <PersonIcon className="personal-account-profile__menu-icon" />
                            <span className="personal-account-profile__menu-title">Мой профиль</span>
                        </li>
                        <li className={menuItemClasses('MyCourses')} onClick={() => onMenuItemClick('MyCourses')}>
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
                                <li
                                    className={menuItemClasses('UserList', true)}
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
            {/* <video className="video-modal-content__video" src={videoTest} controls /> */}
        </div>
    );
};

export default PersonalAccount;
