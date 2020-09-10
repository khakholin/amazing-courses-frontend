import React, { useEffect, useState } from 'react';

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
    // eslint-disable-next-line
    const [initialEmail, setInitialEmail] = useLocalStorage('initialEmail', '');
    const [dataList, setDataList] = useState<IUserCoursesData>();
    const [userCourseProgress, setUserCourseProgress] = useState<IUserCourseProgress[] | undefined>([]);

    useEffect(() => {
        appRequest('/api/user/available-courses', 'POST', { email: initialEmail })
            .then(response => {
                appRequest('/api/user/courses', 'POST', { availableCourses: response.data })
                    .then(response => {
                        setDataList(response.data);
                    });
            });
        appRequest('/api/user/course-progress', 'POST', { email: initialEmail })
            .then(response => {
                setUserCourseProgress(response.data);
            });
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

    return (
        <div className="courses page-container">
            <div className="courses-block">
                <div className="courses-header">
                    <div className="courses-header__left">
                        <span className="courses-header__title">Материалы курсов</span>
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
                                email={initialEmail}
                                courseProgress={curCourse}
                                items={item.courseLectures}
                                key={item.courseName}
                                numberItems={item.numOfLectures}
                                time={item.courseTime}
                                title={item.courseName}
                                folder={item.courseFolder}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Courses;
