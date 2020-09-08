import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import DescriptionIcon from '@material-ui/icons/Description';

import timeConversion from '../../../utils/timeConversion';
import { ILectureData } from '../../../types/inputPropsFormats';
import endingForNumber from '../../../utils/endingForNumber';

import './dropdownListStyle.scss';
import VideoModal from '../VideoModal/VideoModal';
import { IUserCourseProgress } from '../../../types/responseTypes';
import { appRequest } from '../../../modules/app/appRequest';
import ModalComponent from '../ModalComponent/ModalComponent';
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button, Input } from '@material-ui/core';

export interface IDropdownList {
    courseProgress: IUserCourseProgress | undefined;
    items: ILectureData[];
    numberItems: number;
    time: number;
    title: string;
    folder: string;
    email: string;
}


const DropdownList = (props: IDropdownList) => {
    const [expanded, setExpanded] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openTestingModal, setOpenTestingModal] = useState(false);
    const [currentTestingData, setCurrentTestingData] = useState([]);
    const [answersArray, setAnswersArray] = useState<any>([]);
    const [modalTitle, setModalTitle] = useState('');
    const [openedLecture, setOpenedLecture] = useState(-1);
    const [isAcceptButtonActive, setIsAcceptButtonActive] = useState(false);
    const [isAlreadyTested, setIsAlreadyTested] = useState(false);
    const [answersPercent, setAnswersPercent] = useState(0);
    // eslint-disable-next-line
    const [updateFlag, setUpdateFlag] = useState(0);

    const handleOpenModal = (title: string, lecture: number) => {
        setModalTitle(title);
        setOpenedLecture(lecture);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const onTestingClick = (courseName: string, lectureTitle: string) => {
        appRequest('/api/testing/data-watch', 'POST', { courseName, lectureTitle })
            .then(response => {
                if (response) {
                    setCurrentTestingData(response.data);
                    setModalTitle(lectureTitle);
                    setOpenTestingModal(true);
                }
            });
        appRequest('/api/user/testing-progress', 'POST', { email: props.email, courseName, lectureTitle })
            .then(response => {
                if (response) {
                    if (response.data.message === 'COURSE_PROGRESS_NOT_FOUND') {
                        setIsAlreadyTested(false);
                        setAnswersPercent(0);
                    } else {
                        setAnswersArray(response.data.answers);
                        setIsAlreadyTested(true);
                        setAnswersPercent(response.data.percent);
                    }
                }
            });
    }

    const handleCloseAddTestingModal = () => {
        setCurrentTestingData([]);
        setAnswersArray([]);
        setIsAlreadyTested(false);
        setOpenTestingModal(false);
        setIsAcceptButtonActive(false);
        setUpdateFlag(0);
    }

    const handleAnswerChange = (event: any, index: number) => {
        const newAnswers = answersArray;
        newAnswers[index] = event.target.value;
        setAnswersArray(newAnswers);
        let realAnswersArrayLength = 0;
        answersArray.map((item: any) => item ? realAnswersArrayLength++ : realAnswersArrayLength);
        setIsAcceptButtonActive(currentTestingData.length === realAnswersArrayLength);
        setUpdateFlag(updateFlag + 1);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault()
        appRequest('/api/testing/check', 'POST', {
            courseName: props.title, lectureTitle: modalTitle, lectureAnswers: answersArray, email: props.email,
        })
            .then(response => {
                handleCloseAddTestingModal();
            });
    }

    return (
        <div className="dropdown-list">
            <div
                className='dropdown-list-header'
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <div className="dropdown-list-header__left">
                    <span className="dropdown-list-header__icon">{expanded ? '-' : '+'}</span>
                    <span className="dropdown-list-header__title">{props.title}</span>
                </div>
                <div className="dropdown-list-header__right">
                    <span className="dropdown-list-header__number">{props.numberItems + ' лекци' + endingForNumber(props.numberItems)}</span>
                    <span className="dropdown-list-header__time">{timeConversion(props.time)}</span>
                </div>
            </div>
            <Collapse in={expanded} timeout="auto" unmountOnExit >
                {
                    props.items.map((item: ILectureData, index: number) => {
                        const dropDownListItemClass = clsx('dropdown-list-item', {
                            'dropdown-list-item_available': (props.courseProgress?.availableLectures.find(item => item === index) !== undefined),
                            'dropdown-list-item_not-available': (props.courseProgress?.availableLectures.find(item => item === index) === undefined),
                        });

                        const dropDownListItemProgressClass = clsx('dropdown-list-item__progress', {
                            'dropdown-list-item__progress_active': (props.courseProgress?.availableLectures.find(item => item === index) !== undefined),
                            'dropdown-list-item__progress_inactive': (props.courseProgress?.availableLectures.find(item => item === index) === undefined),
                        });

                        const dropDownListItemLineClass = clsx('dropdown-list-item__line', {
                            'dropdown-list-item__line_active': (props.courseProgress?.checkedLectures.find(item => item === index) !== undefined),
                            'dropdown-list-item__line_inactive': (props.courseProgress?.checkedLectures.find(item => item === index) === undefined),
                        });

                        return (
                            <div
                                className={dropDownListItemClass}
                                key={item.lectureTitle}
                            >
                                <div className={dropDownListItemProgressClass} style={!expanded ? { display: 'none' } : { display: 'flex' }}>
                                    {
                                        (props.courseProgress?.checkedLectures.find(item => item === index) !== undefined) ?
                                            <CheckCircleIcon className="dropdown-list-item__check" /> :
                                            <RadioButtonCheckedIcon className="dropdown-list-item__check" />
                                    }
                                    {index !== 0 ?
                                        <div className={dropDownListItemLineClass}></div> :
                                        <Fragment />
                                    }
                                </div>
                                <div className="dropdown-list-item__right"
                                    onClick={() => {
                                        if (props.courseProgress?.availableLectures.find(item => item === index) !== undefined) {
                                            handleOpenModal(item.lectureTitle, index);
                                        }
                                    }}
                                >
                                    <div className="dropdown-list-item__name">
                                        <PlayArrowIcon className="dropdown-list-item__icon" />
                                        <span className="dropdown-list-item__title">{item.lectureTitle}</span>
                                    </div>
                                    <span className="dropdown-list-item__time">{timeConversion(item.lectureTime)}</span>
                                </div>
                                <div className="dropdown-list-item__testing" style={!expanded ? { display: 'none' } : { display: 'flex' }} onClick={() => {
                                    if (props.courseProgress?.availableLectures.find(item => item === index) !== undefined) {
                                        onTestingClick(props.title, item.lectureTitle)
                                    }
                                }}>
                                    <DescriptionIcon />
                                </div>
                            </div>
                        )
                    })
                }
            </Collapse>
            {openModal ?
                <VideoModal
                    closeHandler={handleCloseModal}
                    isOpen={openModal}
                    lectureTitle={modalTitle}
                    lectureNumber={openedLecture + 1}
                    lectureFolder={props.folder}
                /> : <Fragment />
            }
            {
                openTestingModal ?
                    <ModalComponent
                        closeHandler={handleCloseAddTestingModal}
                        error
                        isOpen={openTestingModal}
                        text={''}
                        title={'Тестирование - ' + modalTitle}
                    >
                        {
                            isAlreadyTested ?
                                <div>Результат прохождения: {+(answersPercent * 100).toFixed()}% правильных ответов</div> :
                                <Fragment />
                        }
                        <form onSubmit={handleSubmit}>
                            <FormControl component="fieldset" className="dropdown-list-form">
                                {
                                    currentTestingData?.map((item: any, index: number) => {
                                        return (
                                            <div className="dropdown-list-question" key={index}>
                                                <div className="dropdown-list-question__number">Вопрос № {index + 1}</div>
                                                <FormLabel className="dropdown-list-question__label" component="legend">{item.question}</FormLabel>
                                                {item.isAnswerOptions ?
                                                    <RadioGroup aria-label={item.question} name={item.question} value={answersArray[index]} onChange={(e) => handleAnswerChange(e, index)}>
                                                        {
                                                            item?.answerOptions?.map((option: any, i: number) => {
                                                                return isAlreadyTested ?
                                                                    <FormControlLabel value={option} control={<Radio className="dropdown-list-item__radio" />} disabled label={option} checked={answersArray[index] === option} /> :
                                                                    <FormControlLabel value={option} control={<Radio className="dropdown-list-item__radio" />} label={option} />
                                                            })
                                                        }
                                                    </RadioGroup> :
                                                    <Input disabled={isAlreadyTested ? true : false} className="dropdown-list-item__input" placeholder="Правильный ответ" multiline value={answersArray[index]} onChange={(e: any) => handleAnswerChange(e, index)} />
                                                }
                                            </div>
                                        )
                                    })
                                }
                                <div className="dropdown-list-buttons">
                                    {
                                        //ЗАМЕНИТЬ
                                        isAcceptButtonActive ?
                                            <Button
                                                className="button-primary"
                                                type="submit"
                                                variant="outlined"
                                                onClick={() => { }}
                                            >
                                                Отправить на проверку
                                    </Button> :
                                            <Button
                                                disabled
                                                variant="outlined"
                                            >
                                                Отправить на проверку
                                    </Button>
                                    }
                                </div>
                            </FormControl>
                        </form>
                    </ModalComponent> : <Fragment />
            }
        </div>
    )
}

export default DropdownList;