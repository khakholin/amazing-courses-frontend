import React, { Fragment } from 'react';

import './courseListStyle.scss';

export interface ICourseListProps { }

const CourseList = (props: ICourseListProps) => {
    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Список курсов</div>
                <div className="personal-account-info-header__description">
                    Редактирование курсов
                    <br></br>
                    <span>доступно только администраторам</span>
                </div>
            </div>
            <div className="course-list-component personal-account-info-body">
                редактирование и добавление курсов
            </div>
        </Fragment>
    );
};

export default CourseList;
