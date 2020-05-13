import React, { useEffect, useState } from 'react';

import DropdownList from '../../components/common/DropdownList/DropdownList';
import { endpoints } from '../../constants/endpoints';
import { appRequest } from '../../modules/app/appRequest';
import { IUserData } from '../../types/inputPropsFormats';
import endingForNumber from '../../utils/endingForNumber';
import { removeCookie } from '../../utils/operationsWithCookie';
import timeConversion from '../../utils/timeConversion';

import './personalAreaStyle.scss';

export interface IPersonalArea { };

const PersonalArea = (props: IPersonalArea) => {
    const [dataList, setDataList] = useState<IUserData[]>();

    useEffect(() => {
        appRequest(endpoints.getProfile, 'GET')
            .then((response) => {
                if (response.data.availableCourses) {
                    appRequest(endpoints.getCourses, 'POST', { availableCourses: response.data.availableCourses })
                        .then((response) => {
                            setDataList(response.data);

                        });
                }
            });
    }, []);
    console.log(dataList);

    return (
        <div className="personal-area page-container">
            <div
                onClick={() => {
                    removeCookie('auth');
                }}
            >
                DEL TOKEN
            </div>
            <div className="personal-area-block">
                {/* <div className="personal-area-header">
                    <div className="personal-area-header__left">
                        <span className="personal-area-header__title">Материалы курса</span>
                    </div>
                    <div className="personal-area-header__right">
                        <span className="personal-area-header__number">{dataList?.data.totalNumOfLectures + ' лекци' + endingForNumber(dataList?.data.totalNumOfLectures)}</span>
                        <span className="personal-area-header__time">{timeConversion(dataList?.data.totalTime)}</span>
                    </div>
                </div> */}
                {
                    dataList?.map((item: any) => {
                        return (
                            <DropdownList
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
