import React, { useState, useEffect } from 'react';
import HelpIcon from '@material-ui/icons/Help';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Tooltip from '@material-ui/core/Tooltip';

import { appRequest } from '../../../../modules/app/appRequest';
import { IUserProfileResponse, IUserCourseProgress } from '../../../../types/responseTypes';
import { ICourseData, ILectureData } from '../../../../types/inputPropsFormats';

import './userInformationStyle.scss';

export interface IUserInformationProps {
    user: IUserProfileResponse | undefined;
}

const UserInformation = (props: IUserInformationProps) => {
    useEffect(() => {
        appRequest('/api/course/list', 'GET')
            .then(response => {
                setCourseList(response.data)
            });
        setUserAvailableCourses(props.user?.availableCourses);
        setUserCourseProgress(props.user?.courseProgress);
        appRequest('/api/user/courses', 'POST', { availableCourses: props.user?.availableCourses })
            .then((response) => {
                setCoursesDataList(response.data.courses);
            });
        appRequest('/api/user/get-users', 'GET')
            .then(response => {
                setUsersList(response.data)
            });
        appRequest('/api/user/mentors', 'POST', { email: props.user?.email })
            .then(response => {
                setUserMentors(response.data);
            });
        // eslint-disable-next-line
    }, [])

    const [courseList, setCourseList] = useState([]);
    const [userMentors, setUserMentors] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [userAvailableCourses, setUserAvailableCourses] = useState<string[] | undefined>([]);
    const [userCourseProgress, setUserCourseProgress] = useState<IUserCourseProgress[] | undefined>([]);
    const [coursesDataList, setCoursesDataList] = useState<ICourseData[]>([]);

    const onCourseClick = (course: string) => {
        appRequest('/api/user/change-courses', 'POST', { email: props.user?.email, courseName: course })
            .then(response => {
                appRequest('/api/user/available-courses', 'POST', { email: props.user?.email })
                    .then(response => {
                        setUserAvailableCourses(response.data);
                        appRequest('/api/user/courses', 'POST', { availableCourses: response.data })
                            .then(response => {
                                setCoursesDataList(response.data.courses);
                            });
                    });
            });
    }

    const onUsernameClick = (mentor: string) => {
        appRequest('/api/user/change-mentors', 'POST', { email: props.user?.email, mentor })
            .then(response => {
                appRequest('/api/user/mentors', 'POST', { email: props.user?.email })
                    .then(response => {
                        setUserMentors(response.data);
                    });
            });
    }

    const onLectureAvailableClick = (course: string, availableLecture: number) => {
        appRequest('/api/user/change-available-lecture', 'POST', { email: props.user?.email, courseName: course, availableLecture })
            .then(response => {
                appRequest('/api/user/course-progress', 'POST', { email: props.user?.email })
                    .then(response => {
                        setUserCourseProgress(response.data);
                    });
            });
    }

    const onLectureCheckedClick = (course: string, checkedLecture: number) => {
        appRequest('/api/user/change-check-lecture', 'POST', { email: props.user?.email, courseName: course, checkedLecture })
            .then(response => {
                appRequest('/api/user/course-progress', 'POST', { email: props.user?.email })
                    .then(response => {
                        setUserCourseProgress(response.data);
                    });
            });
    }

    return (
        <div className="user-information-component personal-account-info-body">
            <div className="user-information-component-profile">
                <div className="user-information-component-profile__item">
                    <div className="user-information-component-profile__item-title">Email:</div>
                    <div className="user-information-component-profile__item-data">{props.user?.email}</div>
                </div>
                <div className="user-information-component-profile__item">
                    <div className="user-information-component-profile__item-title">Имя:</div>
                    <div className="user-information-component-profile__item-data">{props.user?.realName}</div>
                </div>
                <div className="user-information-component-profile__item">
                    <div className="user-information-component-profile__item-title">Фамилия:</div>
                    <div className="user-information-component-profile__item-data">{props.user?.realSurname}</div>
                </div>
                <div className="user-information-component-profile__item">
                    <div className="user-information-component-profile__item-title">Школа:</div>
                    <div className="user-information-component-profile__item-data">{props.user?.school}</div>
                </div>
                <div className="user-information-component-profile__item">
                    <div className="user-information-component-profile__item-title">Университет:</div>
                    <div className="user-information-component-profile__item-data">{props.user?.university}</div>
                </div>
                <div className="user-information-component-profile__item">
                    <div className="user-information-component-profile__item-title">Место работы:</div>
                    <div className="user-information-component-profile__item-data">{props.user?.workPlace}</div>
                </div>
            </div>
            <div className="user-information-component-courses">
                <div className="user-information-component-courses__header">
                    <div className="user-information-component-courses__header-text">Добавить ментора для пользователя</div>
                    <Tooltip title="Добавление ментора изменяется нажатием на него">
                        <HelpIcon className="user-information-component-courses__header-icon" />
                    </Tooltip>
                </div>
                <div className="user-information-component-courses-list">
                    {usersList.map((item: any) => {
                        const checked = userMentors.find(mentor => item.email === mentor);
                        return (
                            <div
                                className="user-information-component-courses-list__item"
                                onClick={() => onUsernameClick(item.email)}
                            >
                                {
                                    checked ?
                                        <CheckBoxIcon className="user-information-component-courses-list__checkbox" /> :
                                        <CheckBoxOutlineBlankIcon className="user-information-component-courses-list__checkbox" />

                                }
                                <div className="user-information-component-courses-list__title" >{item.realName + ' ' + item.realSurname}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="user-information-component-courses">
                <div className="user-information-component-courses__header">
                    <div className="user-information-component-courses__header-text">Изменить доступ пользователя к курсам</div>
                    <Tooltip title="Доступ к курсу изменяется нажатием на него">
                        <HelpIcon className="user-information-component-courses__header-icon" />
                    </Tooltip>
                </div>
                <div className="user-information-component-courses-list">
                    {userAvailableCourses && courseList.map((course) => {
                        const checked = userAvailableCourses.find((availableCourse) => availableCourse === course);
                        return (
                            <div
                                className="user-information-component-courses-list__item"
                                onClick={() => onCourseClick(course)}
                            >
                                {
                                    checked ?
                                        <CheckBoxIcon className="user-information-component-courses-list__checkbox" /> :
                                        <CheckBoxOutlineBlankIcon className="user-information-component-courses-list__checkbox" />

                                }
                                <div className="user-information-component-courses-list__title" >{course}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {
                coursesDataList && coursesDataList.map((course: ICourseData) => {
                    let availableLectures: number[] = [];
                    let checkedLectures: number[] = [];
                    userCourseProgress && userCourseProgress.find((item) => {
                        if (item.courseName === course.courseName) {
                            availableLectures = item.availableLectures;
                            checkedLectures = item.checkedLectures;
                            return true
                        }
                        return false
                    })
                    return (
                        <div className="user-information-component-lectures">
                            <div className="user-information-component-lectures__header">
                                <div className="user-information-component-lectures__header-course">{course.courseName}</div>
                                <div className="user-information-component-lectures__header-description">
                                    <div className="user-information-component-lectures__header-text">Изменить прогресс курса для пользователя</div>
                                    <Tooltip title="Доступ к лекции и ее статус изменяются нажатием на соответствующие кнопки">
                                        <HelpIcon className="user-information-component-lectures__header-icon" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="user-information-component-lectures-list">
                                {
                                    course.courseLectures.map((lecture: ILectureData, index: number) => {
                                        return (
                                            <div className="user-information-component-lectures-list__item">
                                                <div className="user-information-component-lectures-list__title">
                                                    <div className="user-information-component-lectures-list__title-description">{'Лекция №' + (index + 1) + ':'}</div>
                                                    <div className="user-information-component-lectures-list__title-data">{lecture.lectureTitle}</div>
                                                </div>
                                                <div className="user-information-component-lectures-list-progress">
                                                    <div
                                                        className="user-information-component-lectures-list-progress__item"
                                                        onClick={() => onLectureAvailableClick(course.courseName, index)}
                                                    >
                                                        {
                                                            (availableLectures.find(item => item === index) !== undefined) ?
                                                                <CheckBoxIcon className="user-information-component-lectures-list-progress__checkbox" /> :
                                                                <CheckBoxOutlineBlankIcon className="user-information-component-lectures-list-progress__checkbox" />
                                                        }
                                                        <div className="user-information-component-lectures-list-progress__title">Доступна</div>
                                                    </div>
                                                    <div
                                                        className="user-information-component-lectures-list-progress__item"
                                                        onClick={() => onLectureCheckedClick(course.courseName, index)}
                                                    >
                                                        {
                                                            (checkedLectures.find(item => item === index) !== undefined) ?
                                                                <CheckBoxIcon className="user-information-component-lectures-list-progress__checkbox" /> :
                                                                <CheckBoxOutlineBlankIcon className="user-information-component-lectures-list-progress__checkbox" />
                                                        }
                                                        <div className="user-information-component-lectures-list-progress__title">Проверена</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default UserInformation;
