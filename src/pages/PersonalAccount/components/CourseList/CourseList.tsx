import React, { Fragment, useEffect, useState } from 'react';

import './courseListStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';
import { ICourseData } from '../../../../types/inputPropsFormats';
import { Button, CircularProgress } from '@material-ui/core';

export interface ICourseListProps { }

const CourseList = (props: ICourseListProps) => {
    useEffect(() => {
        setTimeout(() => setIsLoader(false), 1000);
        appRequest('/api/course/data', 'GET')
            .then(response => {
                setCourseList(response.data);
            });
    }, []);
    const [courseList, setCourseList] = useState([]);
    const [isLoader, setIsLoader] = useState(true);
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
                {
                    isLoader ?
                        <div className="info-form-spinner__wrapper">
                            <CircularProgress
                                className="info-form-spinner__item"
                                size={100}
                                thickness={3}
                            />
                        </div>
                        : <Fragment>
                            <div className="course-list-component__content">
                                {

                                    courseList.length && courseList.map((course: ICourseData) => {
                                        return (
                                            <div
                                                className="course-list-component__item"
                                            // onClick={() => props.onUserProfileClick(user)}
                                            >
                                                {course.courseName}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="course-list-component__button">
                                <Button
                                    className="button-primary"
                                    variant="outlined"
                                // onClick={() => onSaveClick()}
                                >
                                    Создать курс
                            </Button>
                            </div>
                        </Fragment>
                }
            </div>
        </Fragment>
    );
};

export default CourseList;
