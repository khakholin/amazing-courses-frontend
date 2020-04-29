import React from 'react';

import DropdownList from '../../components/common/DropdownList/DropdownList';
import endingForNumber from '../../utils/endingForNumber';

import './personalAreaStyle.scss';

export interface IPersonalArea { };

const mockData = {
    totalNumOfLectures: 8,
    totalTime: '01:16:41',
    data: [
        {
            title: 'React',
            numOfLectures: 5,
            time: '00:39:11',
            lectures: [
                { available: true, checked: true, title: 'Hooks', time: '00:03:02' },
                { available: true, checked: true, title: 'Router', time: '00:05:18' },
                { available: true, checked: false, title: 'Redux', time: '00:12:54' },
                { available: false, checked: false, title: 'Saga', time: '00:10:14' },
                { available: false, checked: false, title: 'Result', time: '00:07:43' },
            ],
        },
        {
            title: 'Кулинария',
            numOfLectures: 3,
            time: '00:37:31',
            lectures: [
                { available: true, checked: true, title: 'Яйца', time: '00:12:31' },
                { available: true, checked: false, title: 'Пончики', time: '00:15:49' },
                { available: false, checked: false, title: 'Блины', time: '00:09:11' },
            ],
        },
    ]
}


const PersonalArea = (props: IPersonalArea) => {
    return (
        <div className="personal-area">
            <div className="personal-area-block">
                <div className="personal-area-header">
                    <div className="personal-area-header__left">
                        <span className="personal-area-header__title">Материалы курса</span>
                    </div>
                    <div className="personal-area-header__right">
                        <span className="personal-area-header__number">{mockData.totalNumOfLectures + ' лекци' + endingForNumber(mockData.totalNumOfLectures)}</span>
                        <span className="personal-area-header__time">{mockData.totalTime}</span>
                    </div>
                </div>
                {
                    mockData.data.map(item => {
                        return (
                            <DropdownList
                                items={item.lectures}
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
