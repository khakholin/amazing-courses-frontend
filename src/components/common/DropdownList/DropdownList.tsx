import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import timeConversion from '../../../utils/timeConversion';
import { ILectureData } from '../../../types/inputPropsFormats';
import endingForNumber from '../../../utils/endingForNumber';

import './dropdownListStyle.scss';
import VideoModal from '../VideoModal/VideoModal';
import { IUserCourseProgress } from '../../../types/responseTypes';
import { appRequest } from '../../../modules/app/appRequest';
import ModalComponent from '../ModalComponent/ModalComponent';
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button } from '@material-ui/core';

export interface IDropdownList {
    courseProgress: IUserCourseProgress | undefined;
    items: ILectureData[];
    numberItems: number;
    time: number;
    title: string;
    folder: string;
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
    }

    const handleCloseAddTestingModal = () => {
        setCurrentTestingData([]);
        setAnswersArray([]);
        setOpenTestingModal(false);
        setIsAcceptButtonActive(false);
    }
    const handleAnswerChange = (event: any, index: number) => {
        const newAnswers = answersArray;
        newAnswers[index] = event.target.value;
        setAnswersArray(newAnswers);
        setIsAcceptButtonActive(currentTestingData.length === answersArray.length);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log(answersArray);
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
                                <div className="dropdown-list-item__testing" style={!expanded ? { display: 'none' } : { display: 'flex' }} onClick={() => onTestingClick(props.title, item.lectureTitle)}>
                                    TEST
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
                        <form onSubmit={handleSubmit}>
                            <FormControl component="fieldset" className="dropdown-list-form">
                                {
                                    currentTestingData?.map((item: any, index: number) => {
                                        return (
                                            <div key={index}>
                                                <FormLabel component="legend">{item.question}</FormLabel>
                                                <RadioGroup aria-label={item.question} name={item.question} value={answersArray[index]} onChange={(e) => handleAnswerChange(e, index)}>
                                                    {
                                                        item?.answerOptions?.map((option: any, index: number) => {
                                                            return (
                                                                <FormControlLabel value={option} control={<Radio className="dropdown-list-item__radio" />} label={option} />
                                                            )
                                                        })
                                                    }
                                                </RadioGroup>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    isAcceptButtonActive ?
                                        <Button
                                            className="button-primary"
                                            type="submit"
                                            variant="outlined"
                                            onClick={() => {
                                                // appRequest('/api/testing/update', 'POST', {
                                                //     courseName: selectedCourseData.courseName, lectureTitle: selectedLecture, lectureQuestions: addedTesting
                                                // })
                                                //     .then(response => {
                                                //         if (response) {
                                                //             handleCloseAddTestingModal();
                                                //         }
                                                //     });
                                            }}
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
                            </FormControl>
                        </form>
                    </ModalComponent> : <Fragment />
            }
        </div>
    )
}

export default DropdownList;