import React, { useState, Fragment, useEffect } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import timeConversion from '../../../utils/timeConversion';
import { ILectureData } from '../../../types/inputPropsFormats';
import endingForNumber from '../../../utils/endingForNumber';

import './dropdownListStyle.scss';
import VideoModal from '../VideoModal/VideoModal';
import { IUserCourseProgress } from '../../../types/responseTypes';
import { appRequest, appRequestFile2 } from '../../../modules/app/appRequest';
import ModalComponent from '../ModalComponent/ModalComponent';
import { FormControlLabel, Radio, RadioGroup, Button, Input, withStyles } from '@material-ui/core';

export interface IDropdownList {
    courseProgress: IUserCourseProgress | undefined;
    items: ILectureData[];
    numberItems: number;
    time: number;
    title: string;
    folder: string;
    email: string;
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

const DropdownList = (props: IDropdownList) => {
    useEffect(() => {
        appRequest('/api/testing/available-tests', 'POST', { courseName: props.title })
            .then((response) => {
                setIsAvailableLecturesTests(response.data.courseTests);
            });
        // eslint-disable-next-line
    }, []);
    const [expanded, setExpanded] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openTestingModal, setOpenTestingModal] = useState(false);
    const [currentTestingData, setCurrentTestingData] = useState([]);
    const [answersArray, setAnswersArray] = useState<any>([]);
    const [userAnswersArray, setUserAnswersArray] = useState<any>([]);
    const [modalTitle, setModalTitle] = useState('');
    const [openedLecture, setOpenedLecture] = useState(-1);
    const [isAcceptButtonActive, setIsAcceptButtonActive] = useState(false);
    const [isAlreadyTested, setIsAlreadyTested] = useState(false);
    const [answersResult, setAnswersResult] = useState<any>({});
    const [isAvailableLecturesTests, setIsAvailableLecturesTests] = useState([]);
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
            .then(async response => {
                if (response) {
                    // let newData = response.data;
                    // let j = 0;


                    // await Promise.all(
                    //     response.data?.map((item: any, index: number) => {
                    //         return appRequestFile2('/api/course/get-image', 'POST', { fileName: props.folder + '-' + lectureTitle + '-' + index })
                    //             .then(async (avatar) => {
                    //                 if (avatar.data.message !== 'TESTING_IMAGE_NOT_FOUND') {
                    //                     let reader = new FileReader();
                    //                     let file = avatar.data;
                    //                     let tst: any;
                    //                     reader.onloadend = () => {
                    //                         newData[index].image = reader.result;
                    //                         tst = reader.result;
                    //                         // setCurrentTestingData(newData);
                    //                         // console.log(index, '-', newData);
                    //                     }

                    //                     await reader.readAsDataURL(file);
                    //                     return { ...item, image: tst };
                    //                 }
                    //             })
                    //     }))
                    //     .then(res => console.log(res))


                    // for (const item of response.data) {
                    //     await appRequestFile2('/api/course/get-image', 'POST', { fileName: props.folder + '-' + lectureTitle + '-' + j })
                    //         .then((avatar) => {
                    //             if (avatar.data.message !== 'TESTING_IMAGE_NOT_FOUND') {
                    //                 let reader = new FileReader();
                    //                 let file = avatar.data;

                    //                 reader.onloadend = () => {
                    //                     newData[j].image = reader.result;
                    //                     console.log(j, '-', newData);
                    //                     j++;
                    //                 }

                    //                 reader.readAsDataURL(file);
                    //             }
                    //         })
                    // }
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
                        setAnswersResult('');
                    } else {
                        setAnswersArray(response.data.answers.map((item: any) => item.rightAnswer));
                        setUserAnswersArray(response.data.answers.map((item: any) => item.userAnswer));
                        setIsAlreadyTested(true);
                        setAnswersResult(response.data.result);
                    }
                }
            });
    }

    const handleCloseAddTestingModal = () => {
        setCurrentTestingData([]);
        setAnswersArray([]);
        setUserAnswersArray([]);
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

    const handleSubmit = () => {
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
                            'dropdown-list-item_available': (props.courseProgress?.availableLectures.find(lec => lec === item.lectureTitle) !== undefined || moment(item.accessDate).isBefore(moment().endOf('day'))),
                            'dropdown-list-item_not-available': (!moment(item.accessDate).isBefore(moment().endOf('day'))),
                        });
                        const dropDownListItemProgressClass = clsx('dropdown-list-item__progress', {
                            'dropdown-list-item__progress_active': (props.courseProgress?.availableLectures.find(lec => lec === item.lectureTitle) !== undefined || moment(item.accessDate).isBefore(moment().endOf('day'))),
                            'dropdown-list-item__progress_inactive': (!moment(item.accessDate).isBefore(moment().endOf('day'))),
                        });
                        const dropDownListItemLineClass = clsx('dropdown-list-item__line', {
                            'dropdown-list-item__line_active': (props.courseProgress?.checkedLectures.find(lec => lec === item.lectureTitle) !== undefined),
                            'dropdown-list-item__line_inactive': (props.courseProgress?.checkedLectures.find(lec => lec === item.lectureTitle) === undefined),
                        });
                        return (
                            <div
                                className={dropDownListItemClass}
                                key={item.lectureTitle}
                            >
                                <div className={dropDownListItemProgressClass} style={!expanded ? { display: 'none' } : { display: 'flex' }}>
                                    {
                                        (props.courseProgress?.checkedLectures.find(lec => lec === item.lectureTitle) !== undefined) ?
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
                                        if (props.courseProgress?.availableLectures.find(lec => lec === item.lectureTitle) !== undefined || moment(item.accessDate).isBefore(moment().endOf('day'))) {
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
                                <div className="dropdown-list-item__testing" style={(!expanded || !isAvailableLecturesTests?.find((l: any) => l?.lectureTitle === item.lectureTitle && l?.lectureQuestions?.length)) ? { display: 'none' } : { display: 'flex' }} onClick={() => {
                                    if (props.courseProgress?.availableLectures.find(lec => lec === item.lectureTitle) !== undefined || moment(item.accessDate).isBefore(moment().endOf('day'))) {
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
                    lectureAdditional={props.items[openedLecture].additionalMaterials}
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
                                <div>Правильных ответов: {answersResult.right} из {answersResult.total}</div> :
                                <Fragment />
                        }
                        <div className="dropdown-list-form">
                            {
                                currentTestingData?.map((item: any, index: number) => {
                                    return (
                                        <div className="dropdown-list-question" key={index}>
                                            <div className="dropdown-list-question-title">
                                                {
                                                    isAlreadyTested ?
                                                        (
                                                            answersArray[index] === userAnswersArray[index] ?
                                                                <CheckIcon style={{ 'color': 'green' }} /> :
                                                                <CloseIcon style={{ 'color': 'red' }} />
                                                        )
                                                        : <Fragment />
                                                }
                                                <span
                                                    className={isAlreadyTested ? "dropdown-list-question-title__number dropdown-list-question-title__number_tested" : "dropdown-list-question-title__number"}
                                                >
                                                    Вопрос № {index + 1}
                                                </span>
                                            </div>
                                            {/* <img className="personal-account-profile__avatar" src={item?.image} alt="" /> */}
                                            <div className="dropdown-list-question__label">{item.question}</div>
                                            {item.isAnswerOptions ?
                                                <RadioGroup aria-label={item.question} name={item.question} value={answersArray[index]} onChange={(e) => handleAnswerChange(e, index)}>
                                                    {
                                                        item?.answerOptions?.map((option: any, i: number) => {
                                                            return isAlreadyTested ?
                                                                <FormControlLabel control=
                                                                    {
                                                                        answersArray[index] === option ?
                                                                            <GreenRadio /> :
                                                                            <RedRadio />
                                                                    }
                                                                    disabled label={option} checked={answersArray[index] === option || userAnswersArray[index] === option}
                                                                /> :
                                                                <FormControlLabel value={option} control={<Radio className="dropdown-list-item__radio" />} label={option} />
                                                        })
                                                    }
                                                </RadioGroup> :
                                                <Fragment>
                                                    <Input
                                                        className="dropdown-list-item__input"
                                                        disabled={isAlreadyTested ? true : false}
                                                        multiline
                                                        onChange={(e: any) => handleAnswerChange(e, index)}
                                                        placeholder="Правильный ответ"
                                                        value={userAnswersArray[index]}
                                                    />
                                                    {
                                                        isAlreadyTested && (answersArray[index] !== userAnswersArray[index]) ?
                                                            <Fragment>
                                                                <br></br>
                                                                <div className="dropdown-list-item__right-answer">Правильный ответ: {answersArray[index]}</div>
                                                            </Fragment>
                                                            : <Fragment />
                                                    }
                                                </Fragment>
                                            }
                                        </div>
                                    )
                                })
                            }
                            {
                                !isAlreadyTested ?
                                    <div className="dropdown-list-buttons">
                                        {
                                            isAcceptButtonActive ?
                                                <Button
                                                    className="button-primary"
                                                    type="submit"
                                                    variant="outlined"
                                                    onClick={() => handleSubmit()}
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
                                    </div> : <Fragment />
                            }
                        </div>
                    </ModalComponent> : <Fragment />
            }
        </div>
    )
}

export default DropdownList;