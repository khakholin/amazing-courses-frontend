import React, { useEffect, useState } from 'react';

import { endpoints } from '../../constants/endpoints';
import { appRequest } from '../../modules/app/appRequest';
import { IUserData } from '../../types/inputPropsFormats';

import './coursesStyle.scss';
import DropdownList from '../../components/common/DropdownList/DropdownList';
import timeConversion from '../../utils/timeConversion';
import endingForNumber from '../../utils/endingForNumber';

export interface ICourses { };

const Courses = (props: ICourses) => {
    const [dataList, setDataList] = useState<IUserData>();
    const [availableCourses, setAvailableCourses] = useState([]);

    useEffect(() => {
        appRequest(endpoints.getProfile, 'GET')
            .then((response) => {
                if (response.data.availableCourses) {
                    setAvailableCourses(response.data.availableCourses);
                    appRequest(endpoints.getCourses, 'POST', { availableCourses: response.data.availableCourses })
                        .then((response) => {
                            setDataList(response.data)
                        });
                }
            });
    }, []);

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
                    dataList?.data.map((item: any) => {
                        const curCourse = availableCourses.find((course: any) => course.title === item.title);
                        return (
                            <DropdownList
                                availableCourses={curCourse}
                                items={item.lectures}
                                key={item.title}
                                numberItems={item.numOfLectures}
                                time={item.time}
                                title={item.title}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Courses;
