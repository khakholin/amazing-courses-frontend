import React, { useEffect, useState } from 'react';

import DropdownList from '../../components/common/DropdownList/DropdownList';
import { endpoints } from '../../constants/endpoints';
import { appRequest } from '../../modules/app/appRequest';
import { IUserData } from '../../types/inputPropsFormats';
import endingForNumber from '../../utils/endingForNumber';
import { removeCookie } from '../../utils/operationsWithCookie';
import timeConversion from '../../utils/timeConversion';

import './personalAreaStyle.scss';
import appHistory from '../../modules/app/appHistory';

export interface IPersonalArea { };

const PersonalArea = (props: IPersonalArea) => {
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
        <div className="personal-area page-container">
            <div
                onClick={() => {
                    removeCookie('auth');
                    appHistory.push('/login');
                }}
                style={{ cursor: 'pointer', marginBottom: '20px', fontWeight: 700 }}
            >
                ВЫЙТИ
            </div>
            <div className="personal-area-block">
                <div className="personal-area-header">
                    <div className="personal-area-header__left">
                        <span className="personal-area-header__title">Материалы курса</span>
                    </div>
                    <div className="personal-area-header__right">
                        <span className="personal-area-header__number">{dataList?.totalNumOfLectures + ' лекци' + endingForNumber(dataList?.totalNumOfLectures)}</span>
                        <span className="personal-area-header__time">{timeConversion(dataList?.totalTime)}</span>
                    </div>
                </div>
                {
                    dataList?.data.map((item: any, index: number) => {
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

export default PersonalArea;
