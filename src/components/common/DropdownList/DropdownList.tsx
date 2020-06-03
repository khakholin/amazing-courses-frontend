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
    const [modalTitle, setModalTitle] = useState('');
    const [openedLecture, setOpenedLecture] = useState(-1);

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
                                onClick={() => {
                                    if (props.courseProgress?.availableLectures.find(item => item === index) !== undefined) {
                                        handleOpenModal(item.lectureTitle, index);
                                    }
                                }}
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
                                <div className="dropdown-list-item__right">
                                    <div className="dropdown-list-item__name">
                                        <PlayArrowIcon className="dropdown-list-item__icon" />
                                        <span className="dropdown-list-item__title">{item.lectureTitle}</span>
                                    </div>
                                    <span className="dropdown-list-item__time">{timeConversion(item.lectureTime)}</span>
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
        </div>
    )
}

export default DropdownList;