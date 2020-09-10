import React, { Fragment, useEffect, useState } from 'react';
import { CircularProgress, RadioGroup, FormControlLabel, Radio, withStyles, Input, } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import './studentSuccessStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';
import { IUserCoursesData } from '../../../../types/inputPropsFormats';
import ModalComponent from '../../../../components/common/ModalComponent/ModalComponent';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

export interface IStudentSuccessProps {
    email?: string;
    roles?: string[];
}

const GreenRadio = withStyles({
    root: {
        '&$checked': {
            color: 'green',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const RedRadio = withStyles({
    root: {
        '&$checked': {
            color: 'red',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const StudentSuccess = (props: IStudentSuccessProps) => {
    const [courseList, setCourseList] = useState<IUserCoursesData>();
    const [currentUser, setCurrentUser] = useState<any>({});
    const [isLoader, setIsLoader] = useState(true);
    const [isUserSelect, setIsUserSelect] = useState(false);
    const [userCourseProgress, setUserCourseProgress] = useState<any>([]);
    const [users, setUsers] = useState([]);
    const [showMoreModal, setShowMoreModal] = useState(false);
    const [selectedTesting, setSelectedTesting] = useState<any>({});
    const [currentTestingData, setCurrentTestingData] = useState([]);

    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
        appRequest('/api/user/get-students', 'POST', { email: props.email, roles: props.roles })
            .then(response => {
                setUsers(response.data);
            });
    }, [props.email, props.roles]);

    const onStudentClick = (user: any) => {
        appRequest('/api/user/available-courses', 'POST', { email: user.email })
            .then(response => {
                appRequest('/api/user/courses', 'POST', { availableCourses: response.data })
                    .then(response => {
                        setIsUserSelect(true);
                        setCurrentUser(user);
                        setCourseList(response.data);
                    });
            });
        appRequest('/api/user/course-progress', 'POST', { email: user.email })
            .then(response => {
                setUserCourseProgress(response.data);
            });
    }

    const handleCloseShowMoreModal = () => {
        setCurrentTestingData([]);
        setSelectedTesting({});
        setShowMoreModal(false);
    }

    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Успехи учеников</div>
                <div className="personal-account-info-header__description">
                    Прогресс прохождения курсов учениками
                    <br></br>
                    <div className="personal-account-info-header__description_mentor">доступно только учителям</div>
                </div>
            </div>
            <div className="student-success-component personal-account-info-body">
                {
                    isLoader ?
                        <div className="info-form-spinner__wrapper">
                            <CircularProgress
                                className="info-form-spinner__item"
                                size={100}
                                thickness={3}
                            /></div> :
                        (
                            !isUserSelect ?
                                <Fragment>
                                    {
                                        users.length && users.map((user: any, index: number) => {
                                            return (
                                                <div
                                                    className="user-list-component__item"
                                                    onClick={() => onStudentClick(user)}
                                                >
                                                    {
                                                        user.realName + ' ' + user.realSurname
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </Fragment> :
                                <div className="student-success-wrapper">
                                    <div className="student-success-header">
                                        <div className="student-success-header__title">Результаты тестирования ученика:</div>
                                        <div className="student-success-header__user">{currentUser.realName + ' ' + currentUser.realSurname}</div>
                                    </div>
                                    {courseList?.courses?.map((course: any) => {
                                        const courseProgress = userCourseProgress?.find((progress: any) => course.courseName === progress.courseName);
                                        let numOfLectures = 0;
                                        return (
                                            <div className="student-success-course">
                                                <div className="student-success-course-header">
                                                    {course.courseName}
                                                </div>
                                                <div className="student-success-course-body">
                                                    {
                                                        course?.courseLectures?.map((lecture: any, index: number) => {
                                                            const lectureProgress = courseProgress?.lecturesTesting?.find((l: any) => l.lectureTitle === lecture.lectureTitle);

                                                            if (lectureProgress) {
                                                                numOfLectures++;
                                                                return (
                                                                    <div className="student-success-course-body__lecture">
                                                                        <div className="student-success-course-body__left">
                                                                            <div className="student-success-course-body__text">
                                                                                Лекция №{index + 1}:
                                                                            </div>
                                                                            <div className="student-success-course-body__lecture-title">
                                                                                {lecture.lectureTitle}
                                                                            </div>
                                                                            <div className="student-success-course-body__text">
                                                                                Правильных ответов:
                                                                            </div>
                                                                            <div className="student-success-course-body__right-answers">
                                                                                {lectureProgress.result.right}
                                                                            </div>
                                                                            из
                                                                            <div className="student-success-course-body__total-answers">
                                                                                {lectureProgress.result.total}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div
                                                                                className="student-success-course-body__show-more"
                                                                                onClick={() => {
                                                                                    appRequest('/api/testing/data-watch', 'POST', { courseName: courseProgress.courseName, lectureTitle: lectureProgress.lectureTitle })
                                                                                        .then(response => {
                                                                                            if (response) {
                                                                                                setCurrentTestingData(response.data);
                                                                                                setSelectedTesting(lectureProgress);
                                                                                                setShowMoreModal(true);
                                                                                            }
                                                                                        });
                                                                                }}
                                                                            >
                                                                                Подробнее
                                                                                <SearchIcon className="student-success-course-body__show-icon" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    {
                                                        !numOfLectures ?
                                                            <div className="student-success-course-body__empty">Ни один тест данного курса не пройден</div> :
                                                            <Fragment />
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                        )
                }
            </div>
            {
                showMoreModal ?
                    <ModalComponent
                        closeHandler={handleCloseShowMoreModal}
                        error
                        isOpen={showMoreModal}
                        text={''}
                        title={'Тестирование - ' + selectedTesting.lectureTitle}
                    >
                        <div>Правильных ответов: {selectedTesting.result.right} из {selectedTesting.result.total}</div>
                        <div className="student-success-form">
                            {
                                currentTestingData?.map((item: any, index: number) => {
                                    return (
                                        <div className="student-success-question" key={index}>
                                            <div className="student-success-question-title">
                                                {
                                                    selectedTesting?.answers?.[index]?.rightAnswer === selectedTesting?.answers?.[index]?.userAnswer ?
                                                        <CheckIcon style={{ 'color': 'green' }} /> :
                                                        <CloseIcon style={{ 'color': 'red' }} />
                                                }
                                                <span className="student-success-question-title__number">Вопрос № {index + 1}</span>
                                            </div>
                                            <div className="student-success-question__label">{item.question}</div>
                                            {item.isAnswerOptions ?
                                                <RadioGroup
                                                    aria-label={item.question}
                                                    name={item.question}
                                                    value={selectedTesting?.answers?.[index]?.rightAnswer}
                                                >
                                                    {
                                                        item?.answerOptions?.map((option: any, i: number) => {
                                                            return (
                                                                <FormControlLabel control=
                                                                    {
                                                                        selectedTesting?.answers?.[index]?.rightAnswer === option ?
                                                                            <GreenRadio /> :
                                                                            <RedRadio />

                                                                    }
                                                                    disabled label={option} checked={selectedTesting.answers[index].rightAnswer === option || selectedTesting?.answers?.[index]?.userAnswer === option}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </RadioGroup> :
                                                <Fragment>
                                                    <Input
                                                        className="student-success__input"
                                                        disabled
                                                        multiline
                                                        placeholder="Правильный ответ"
                                                        value={selectedTesting?.answers?.[index]?.userAnswer}
                                                    />
                                                    {
                                                        selectedTesting?.answers?.[index]?.rightAnswer !== selectedTesting?.answers?.[index]?.userAnswer ?
                                                            <Fragment>
                                                                <br></br>
                                                                <div className="student-success__right-answer">Правильный ответ: {selectedTesting?.answers?.[index]?.rightAnswer}</div>
                                                            </Fragment>
                                                            : <Fragment />
                                                    }
                                                </Fragment>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </ModalComponent> : <Fragment />
            }
        </Fragment >
    );
};

export default StudentSuccess;
