import React, { Fragment } from 'react';
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
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Курсы</div>
                <div className="personal-account-info-header__description">Доступные для вас курсы</div>
            </div>
            <div className="my-courses-component personal-account-info-body">
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
        </Fragment>
    );
};

export default MyCourses;
