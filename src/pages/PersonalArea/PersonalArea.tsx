import React, { useEffect, useState } from 'react';

import DropdownList from '../../components/common/DropdownList/DropdownList';
import { appRequest } from '../../modules/app/appRequest';
import { IUserData } from '../../types/inputPropsFormats';
import endingForNumber from '../../utils/endingForNumber';
import timeConversion from '../../utils/timeConversion';

import './personalAreaStyle.scss';

export interface IPersonalArea { };

const PersonalArea = (props: IPersonalArea) => {
    const [dataList, setDataList] = useState<{ data: IUserData }>();
    useEffect(() => {
        const l = localStorage.getItem('userLogin') || '';
        const p = localStorage.getItem('userPassword') || '';
        appRequest('/api/user/authentication', 'POST', { user: l.substring(1, l.length - 1), password: p.substring(1, p.length - 1) })
            .then((item) => {
                setDataList(item);
            });
    }, []);

    return (
        <div className="personal-area page-container">
            <div className="personal-area-block">
                <div className="personal-area-header">
                    <div className="personal-area-header__left">
                        <span className="personal-area-header__title">Материалы курса</span>
                    </div>
                    <div className="personal-area-header__right">
                        <span className="personal-area-header__number">{dataList?.data.totalNumOfLectures + ' лекци' + endingForNumber(dataList?.data.totalNumOfLectures)}</span>
                        <span className="personal-area-header__time">{timeConversion(dataList?.data.totalTime)}</span>
                    </div>
                </div>
                {
                    dataList?.data.data.map((item: any) => {
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
