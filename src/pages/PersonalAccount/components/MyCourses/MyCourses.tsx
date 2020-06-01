import React from 'react';
import { Button } from '@material-ui/core';

import appHistory from '../../../../modules/app/appHistory';

import './myCoursesStyle.scss';

export interface IMyCoursesProps {
}

const MyCourses = (props: IMyCoursesProps) => {
    const onMyCoursesClick = () => {
        appHistory.push('/courses');
    }

    return (
        <div className="my-courses-component">
            список доступных курсов
            <br></br>
            <Button
                className="button-primary "
                variant="outlined"
                onClick={() => onMyCoursesClick()}
            >
                Страница курсов
            </Button>
        </div>
    );
};

export default MyCourses;
