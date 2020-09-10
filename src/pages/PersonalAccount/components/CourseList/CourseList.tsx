import React, { Fragment, useEffect, useState } from 'react';

import './courseListStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';
import { ICourseData } from '../../../../types/inputPropsFormats';
import { Button, CircularProgress, Input, Checkbox } from '@material-ui/core';
import InputField from '../../../../components/common/InputField/InputField';
import { defaultTranslation } from '../../../../constants/translation';
import ClearIcon from '@material-ui/icons/Clear';
import ModalComponent from '../../../../components/common/ModalComponent/ModalComponent';

export interface ICourseListProps { }

const CourseList = (props: ICourseListProps) => {
    useEffect(() => {
        setTimeout(() => setIsLoader(false), 500);
        appRequest('/api/course/data', 'GET')
            .then(response => {
                setCourseList(response.data);
            });
    }, []);
    const [courseList, setCourseList] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courseNameError, setCourseNameError] = useState({ showCheck: false, status: false, text: '' });
    const [courseFolder, setCourseFolder] = useState('');
    const [courseFolderError, setCourseFolderError] = useState({ showCheck: false, status: false, text: '' });
    const [courseTime, setCourseTime] = useState('');
    const [courseTimeError, setCourseTimeError] = useState({ showCheck: false, status: false, text: '' });
    const [numOfLectures, setNumOfLectures] = useState('');
    const [numOfLecturesError, setNumOfLecturesError] = useState({ showCheck: false, status: false, text: '' });
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [isLoader, setIsLoader] = useState(true);
    const [isCourseInfoMode, setIsCourseInfoMode] = useState(false);
    const [addedLectures, setAddedLectures] = useState<any>([]);
    const [selectedCourseData, setSelectedCourseData] = useState<any>();
    // eslint-disable-next-line
    const [updateFlag, setUpdateFlag] = useState(0);
    const [openAddTestingModal, setOpenAddTestingModal] = useState(false);
    const [addedTesting, setAddedTesting] = useState<any>([]);
    const [selectedLecture, setSelectedLecture] = useState('');

    const onSaveClick = () => {
        setIsCreateMode(true);
    }

    const createCourse = () => {
        appRequest('/api/course/create', 'POST', {
            courseName,
            courseFolder,
            courseTime,
            numOfLectures,
            courseLectures: addedLectures.filter((lecture: any) => lecture.lectureTitle && lecture.lectureTime),
        }).then((response) => {
            if (response) {
                setTimeout(() => setIsLoader(false), 500);
                appRequest('/api/course/data', 'GET')
                    .then(response => {
                        clearData();
                        setCourseList(response.data);
                        setIsCreateMode(false);
                    });
            }
        });
    }

    const clearData = () => {
        setCourseFolder('');
        setCourseFolderError({ showCheck: false, status: false, text: '' });
        setCourseName('');
        setCourseNameError({ showCheck: false, status: false, text: '' });
        setCourseTime('');
        setCourseTimeError({ showCheck: false, status: false, text: '' });
        setNumOfLectures('')
        setNumOfLecturesError({ showCheck: false, status: false, text: '' });
        setAddedLectures([]);
        setUpdateFlag(0);
    }

    const courseNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCourseName(event.target.value);
        if (event.target.value.length) {
            setCourseNameError({ showCheck: true, status: false, text: '' });
        } else {
            setCourseNameError({ showCheck: false, status: false, text: '' });
        }
    };

    const courseFolderChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCourseFolder(event.target.value);
        if (event.target.value.length) {
            setCourseFolderError({ showCheck: true, status: false, text: '' });
        } else {
            setCourseFolderError({ showCheck: false, status: false, text: '' });
        }
    };

    const courseTimeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (+event.target.value || event.target.value === '') {
            setCourseTime(event.target.value);
            if (event.target.value.length) {
                setCourseTimeError({ showCheck: true, status: false, text: '' });
            } else {
                setCourseTimeError({ showCheck: false, status: false, text: '' });
            }
        }
    };

    const numOfLecturesChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNumOfLectures(event.target.value);
        if (event.target.value.length) {
            setNumOfLecturesError({ showCheck: true, status: false, text: '' });
        } else {
            setNumOfLecturesError({ showCheck: false, status: false, text: '' });
        }
    };

    const onAddLectureClick = () => {
        const newLecturesArray = addedLectures;
        newLecturesArray.push({ lectureTime: '', lectureTitle: '' });
        setAddedLectures(newLecturesArray);
        setUpdateFlag(newLecturesArray.length);
    }

    const onLectureDeleteClick = (index: number) => {
        const newLecturesArray = addedLectures;
        newLecturesArray.splice(index, 1);
        setAddedLectures(newLecturesArray);
        setUpdateFlag(newLecturesArray.length);
    }

    const onLectureTitleBlur = (e: any, index: number) => {
        const newLecturesArray = addedLectures.map((lecture: any, i: number) => {
            if (i === index) {
                return { ...lecture, lectureTitle: e.target.value };
            } else {
                return lecture;
            }
        });
        setAddedLectures(newLecturesArray);
        setUpdateFlag(newLecturesArray.length);
    }


    const onAddTestingClick = () => {
        const newTestingArray = addedTesting;
        newTestingArray.push({ question: '', answerOptions: [], isAnswerOptions: false, answer: '' });
        setAddedLectures(newTestingArray);
        setUpdateFlag(newTestingArray.length);
    }

    const onAddTestingAnswerOptionsClick = (index: number) => {
        const newTestingArray = addedTesting.map((testing: any, i: number) => {
            if (i === index) {
                return { ...testing, answerOptions: testing.answerOptions.push(''), isAnswerOptions: true, };
            } else {
                return testing;
            }
        });
        setAddedLectures(newTestingArray);
        setUpdateFlag(newTestingArray?.length);
    }

    const onTestingQuestionChange = (e: any, index: number) => {
        const newTestingArray = addedTesting.map((testing: any, i: number) => {
            if (i === index) {
                return { ...testing, question: e.target.value };
            } else {
                return testing;
            }
        });
        setAddedTesting(newTestingArray);
        setUpdateFlag(newTestingArray.length);
    }

    const onTestingAnswerOptionChange = (e: any, index: number, answerIndex: number) => {
        const newTestingArray = addedTesting.map((testing: any, i: number) => {
            if (i === index) {
                const newAnswerOptions = testing.answerOptions;
                newAnswerOptions[answerIndex] = e.target.value;
                return { ...testing, answerOptions: newAnswerOptions };
            } else {
                return testing;
            }
        });
        setAddedTesting(newTestingArray);
        setUpdateFlag(newTestingArray.length);
    }

    const onTestingAnswerChange = (e: any, index: number) => {
        const newTestingArray = addedTesting.map((testing: any, i: number) => {
            if (i === index) {
                return { ...testing, answer: e.target.value };
            } else {
                return testing;
            }
        });
        setAddedTesting(newTestingArray);
        setUpdateFlag(newTestingArray.length);
    }

    const onLectureTimeBlur = (e: any, index: number) => {
        if (+e.target.value || e.target.value === '') {
            const newLecturesArray = addedLectures.map((lecture: any, i: number) => {
                if (i === index) {
                    return { ...lecture, lectureTime: +e.target.value };
                } else {
                    return lecture;
                }
            });
            setAddedLectures(newLecturesArray);
            setUpdateFlag(newLecturesArray.length);
        }
    }

    const isCreateButtonActive = () => {
        const isLecturesNumberEqual = (+numOfLectures === addedLectures.length);
        const isLecturesUnfilled = addedLectures.find((lecture: any) => !lecture.lectureTitle || !lecture.lectureTime);
        let totalTime = 0;
        addedLectures.map((lecture: any) => totalTime += lecture.lectureTime);

        return courseName && courseFolder && courseTime && numOfLectures
            && isLecturesNumberEqual && !isLecturesUnfilled && totalTime === +courseTime;
    }

    const onCourseDeleteClick = () => {
        appRequest('/api/course/remove', 'POST', { courseName: selectedCourseData.courseName })
            .then((response) => {
                if (response) {
                    setTimeout(() => setIsLoader(false), 500);
                    appRequest('/api/course/data', 'GET')
                        .then(response => {
                            setIsCourseInfoMode(false);
                            setSelectedCourseData(null);
                            setCourseList(response.data);
                        });
                }
            });
    }

    const handleCloseAddTestingModal = () => {
        setOpenAddTestingModal(false);
        setSelectedLecture('');
        setAddedTesting([]);
    };

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
                        : (
                            isCreateMode ?
                                <Fragment>
                                    <InputField
                                        error={courseNameError}
                                        field={{
                                            name: 'courseName',
                                            title: defaultTranslation.courseName,
                                            placeholder: 'Курс',
                                        }}
                                        handleChange={courseNameChange}
                                        value={courseName}
                                    />
                                    <InputField
                                        error={courseFolderError}
                                        field={{
                                            name: 'courseFolder',
                                            title: defaultTranslation.courseFolder,
                                            placeholder: 'Папка',
                                        }}
                                        handleChange={courseFolderChange}
                                        value={courseFolder}
                                    />
                                    <InputField
                                        error={courseTimeError}
                                        field={{
                                            name: 'courseTime',
                                            title: 'Продолжительность курса в секундах',
                                            placeholder: '1337',
                                        }}
                                        handleChange={courseTimeChange}
                                        value={courseTime}
                                    />
                                    <InputField
                                        error={numOfLecturesError}
                                        field={{
                                            name: 'numOfLectures',
                                            title: 'Количество лекций',
                                            placeholder: '10',
                                        }}
                                        handleChange={numOfLecturesChange}
                                        value={numOfLectures}
                                    />
                                    <div className="course-list-component-lectures">
                                        <div className="course-list-component-lectures__header">
                                            <div className="course-list-component-lectures__block" onClick={() => onAddLectureClick()}>
                                                <div className="course-list-component-lectures__header-add">+</div>
                                                <div className="course-list-component-lectures__header-description">
                                                    <div className="course-list-component-lectures__header-text">Добавить лекцию</div>
                                                </div>
                                            </div>
                                            <div></div>
                                        </div>
                                        <div className="course-list-component-lectures-list">
                                            {
                                                addedLectures.map((lecture: any, index: number) => {
                                                    return (
                                                        <div key={index} className="course-list-component-lectures-list__item">
                                                            <div className="course-list-component-lectures-list__title">
                                                                <div className="course-list-component-lectures-list__title-description">{'Лекция №' + (index + 1) + ':'}</div>
                                                                <Input className="course-list-component-lectures-list__input" placeholder="Название" value={lecture.lectureTitle} onChange={(e: any) => onLectureTitleBlur(e, index)} />
                                                                <Input className="course-list-component-lectures-list__input" placeholder="Продолжительность" value={lecture.lectureTime} onChange={(e: any) => onLectureTimeBlur(e, index)} />
                                                            </div>
                                                            <div className="course-list-component-lectures-list-progress">
                                                                <div
                                                                    className="course-list-component-lectures-list-progress__item"
                                                                    onClick={() => onLectureDeleteClick(index)}
                                                                >
                                                                    <div className="course-list-component-lectures-list-progress__title">
                                                                        <ClearIcon />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="course-list-component__button">
                                        <Button
                                            className="button-secondary"
                                            variant="outlined"
                                            onClick={() => {
                                                setIsCreateMode(false);
                                                clearData();
                                            }}
                                        >
                                            Список курсов
                                        </Button>
                                        {isCreateButtonActive() ?
                                            <Button
                                                className="button-primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    createCourse();
                                                }}
                                            >
                                                Создать
                                            </Button> :
                                            <Button
                                                disabled
                                                variant="outlined"
                                            >
                                                Создать
                                            </Button>
                                        }
                                    </div>
                                </Fragment>
                                : (!isCourseInfoMode ?
                                    <Fragment>
                                        <div className="course-list-component__content">
                                            {

                                                courseList.length && courseList.map((course: ICourseData) => {
                                                    return (
                                                        <div
                                                            className="course-list-component__item"
                                                            key={course.courseName}
                                                            onClick={() => {
                                                                setIsCourseInfoMode(true);
                                                                setSelectedCourseData(course);
                                                            }}
                                                        >
                                                            {course.courseName}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="course-list-component__button course-list-component__button_centered">
                                            <Button
                                                className="button-primary"
                                                variant="outlined"
                                                onClick={() => onSaveClick()}
                                            >
                                                Создать курс
                                        </Button>
                                        </div>
                                    </Fragment> :
                                    <Fragment>
                                        <div className="course-list-component__course-info">
                                            <div className="course-list-component__course-name">{selectedCourseData.courseName}</div>
                                            <div className="course-list-component-lectures">
                                                <div className="course-list-component-lectures__header">
                                                    <div className="course-list-component-lectures__block" onClick={() => onAddLectureClick()}>
                                                        <div className="course-list-component-lectures__header-add">+</div>
                                                        <div className="course-list-component-lectures__header-description">
                                                            <div className="course-list-component-lectures__header-text">Добавить лекцию</div>
                                                        </div>
                                                    </div>
                                                    <div></div>
                                                </div>
                                                <div className="course-list-component-lectures-list">
                                                    {
                                                        selectedCourseData.courseLectures.map((item: any, index: number) => {
                                                            return (
                                                                <div key={item.lectureTitle} className="course-list-component-lectures-list__item">
                                                                    <div className="course-list-component-lectures-list__title">
                                                                        <div className="course-list-component-lectures-list__title-description">{'Лекция №' + (index + 1) + ':'}</div>
                                                                        <div className="course-list-component-lectures-list__title-data">{item.lectureTitle}</div>
                                                                    </div>
                                                                    <div className="course-list-component-lectures-list-progress">
                                                                        <div
                                                                            className="course-list-component-lectures-list-progress__item"
                                                                            onClick={() => {
                                                                                appRequest('/api/testing/data-edit', 'POST', { courseName: selectedCourseData.courseName, lectureTitle: item.lectureTitle })
                                                                                    .then(response => {
                                                                                        setAddedTesting(response.data);
                                                                                        setSelectedLecture(item.lectureTitle);
                                                                                        setOpenAddTestingModal(true);
                                                                                    });
                                                                            }}
                                                                        >
                                                                            <div className="course-list-component-lectures-list-progress__title">Редактировать тестирование</div>
                                                                        </div>
                                                                        <div className="course-list-component-lectures-list-progress">
                                                                            <div
                                                                                className="course-list-component-lectures-list-progress__item"
                                                                                onClick={() => onLectureDeleteClick(index)}
                                                                            >
                                                                                <div className="course-list-component-lectures-list-progress__title">
                                                                                    <ClearIcon />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-list-component__button">
                                            <Button
                                                className="button-secondary"
                                                variant="outlined"
                                                onClick={() => {
                                                    setSelectedCourseData(null);
                                                    setIsCourseInfoMode(false);
                                                }}
                                            >
                                                Список курсов
                                        </Button>
                                            <Button
                                                className="button-danger"
                                                variant="outlined"
                                                onClick={() => onCourseDeleteClick()}
                                            >
                                                Удалить курс
                                        </Button>
                                        </div>
                                        <ModalComponent
                                            closeHandler={handleCloseAddTestingModal}
                                            error
                                            isOpen={openAddTestingModal}
                                            text={''}
                                            title={'Добавление тестирования'}
                                        >
                                            <div className="course-list-component__add-testing">
                                                <div className="course-list-component-testing">
                                                    <div className="course-list-component-testing__header">
                                                        <div className="course-list-component-testing__block" onClick={() => onAddTestingClick()}>
                                                            <div className="course-list-component-testing__header-add">+</div>
                                                            <div className="course-list-component-testing__header-description">
                                                                <div className="course-list-component-testing__header-text">Добавить тестовый вопрос</div>
                                                            </div>
                                                        </div>
                                                        <div></div>
                                                    </div>
                                                    <div className="course-list-component-testing-list">
                                                        {addedTesting?.map((testing: any, index: number) => {
                                                            return (
                                                                <div key={index} className="course-list-component-testing-item">
                                                                    {index !== 0 ? <div className="course-list-component__line"></div> : <Fragment />}
                                                                    <div className="course-list-component-testing__question">
                                                                        <div>Вопрос №{index + 1}:</div>
                                                                        <Input className="course-list-component-testing__input" placeholder="Вопрос" multiline value={testing.question} onChange={(e: any) => onTestingQuestionChange(e, index)} />
                                                                    </div>
                                                                    <div className="course-list-component-testing__answer-options">
                                                                        <div className="course-list-component-testing__answer-wrapper">
                                                                            <div className="course-list-component-testing__answer-add" onClick={() => onAddTestingAnswerOptionsClick(index)}>
                                                                                <div className="course-list-component-testing__header-add">+</div>
                                                                                <div>С вариантами ответа</div>
                                                                            </div>
                                                                            <Checkbox
                                                                                checked={testing.isAnswerOptions}
                                                                                onChange={() => {
                                                                                    testing.isAnswerOptions = !testing.isAnswerOptions
                                                                                    setUpdateFlag(testing.isAnswerOptions);
                                                                                }}
                                                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                            />
                                                                        </div>
                                                                        {testing.isAnswerOptions && testing?.answerOptions?.map((answerOption: any, answerIndex: number) => {
                                                                            return (
                                                                                <div key={answerIndex} className="course-list-component-testing__answer-items">
                                                                                    <Input className="course-list-component__testing-input" placeholder={'Вариант ответа ' + (answerIndex + 1)} multiline value={answerOption} onChange={(e: any) => onTestingAnswerOptionChange(e, index, answerIndex)} />
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    <div className="course-list-component-testing__answer">
                                                                        <div>Правильный ответ:</div>
                                                                        <Input className="course-list-component__testing-input" placeholder="Правильный ответ" multiline value={testing.answer} onChange={(e: any) => onTestingAnswerChange(e, index)} />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                                <Button
                                                    className="button-primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        appRequest('/api/testing/update', 'POST', {
                                                            courseName: selectedCourseData.courseName, lectureTitle: selectedLecture, lectureQuestions: addedTesting
                                                        })
                                                            .then(response => {
                                                                if (response) {
                                                                    handleCloseAddTestingModal();
                                                                }
                                                            });
                                                    }}
                                                >
                                                    Сохранить
                                                </Button>
                                            </div>
                                        </ModalComponent>
                                    </Fragment>
                                )
                        )
                }
            </div>
        </Fragment>
    );
};

export default CourseList;
