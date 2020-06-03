import React, { useEffect, useState } from 'react';

import { endpoints } from '../../constants/endpoints';
import { appRequest } from '../../modules/app/appRequest';

import './coursesStyle.scss';
import DropdownList from '../../components/common/DropdownList/DropdownList';
import timeConversion from '../../utils/timeConversion';
import endingForNumber from '../../utils/endingForNumber';
import { getCookieByName } from '../../utils/operationsWithCookie';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import appHistory from '../../modules/app/appHistory';
import { ICourseData, IUserCoursesData } from '../../types/inputPropsFormats';
import { IUserCourseProgress } from '../../types/responseTypes';

export interface ICourses { };

const Courses = (props: ICourses) => {
    // eslint-disable-next-line
    const [currentMenuItem, setCurrentMenuItem] = useLocalStorage('profileMenuItem', 'MyProfile');
    const [dataList, setDataList] = useState<IUserCoursesData>();
    const [userCourseProgress, setUserCourseProgress] = useState<IUserCourseProgress[] | undefined>([]);

    useEffect(() => {
        // TODO get userProgress
        appRequest(endpoints.getProfile, 'GET')
            .then((response) => {
                appRequest('/api/user/available-courses', 'POST', { username: response.data.username })
                    .then(response => {
                        appRequest('/api/user/courses', 'POST', { availableCourses: response.data })
                            .then(response => {
                                setDataList(response.data);
                            });
                    });
                appRequest('/api/user/course-progress', 'POST', { username: response.data.username })
                    .then(response => {
                        setUserCourseProgress(response.data);
                    });
            });
    }, []);

    useEffect(() => {
        if (!getCookieByName('auth')) {
            setCurrentMenuItem('MyProfile')
            appHistory.push('/login');
        }
        // eslint-disable-next-line
    }, [getCookieByName('auth')])

    return (
        <div className="courses page-container">
            <div className="courses-block">
                <div className="courses-header">
                    <div className="courses-header__left">
                        <span className="courses-header__title">Материалы курса</span>
                    </div>
                    <div className="courses-header__right">
                        <span className="courses-header__number">{dataList?.totalNumOfLectures + ' лекци' + endingForNumber(dataList?.totalNumOfLectures)}</span>
                        <span className="courses-header__time">{timeConversion(dataList?.totalTime)}</span>
                    </div>
                </div>
                {
                    dataList && dataList.courses.map((item: ICourseData) => {
                        const curCourse = userCourseProgress?.find((course: IUserCourseProgress) => course.courseName === item.courseName);
                        // TODO get userProgress
                        return (
                            <DropdownList
                                courseProgress={curCourse}
                                items={item.courseLectures}
                                key={item.courseName}
                                numberItems={item.numOfLectures}
                                time={item.courseTime}
                                title={item.courseName}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Courses;
