import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import timeConversion from '../../../utils/timeConversion';
import { IDropdownListItem } from '../../../types/inputPropsFormats';
import endingForNumber from '../../../utils/endingForNumber';

import './dropdownListStyle.scss';

export interface IDropdownList {
    items: IDropdownListItem[];
    numberItems: number;
    time: number;
    title: string;
}


const DropdownList = (props: IDropdownList) => {
    const [expanded, setExpanded] = useState(false);

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
            <Collapse in={expanded} timeout="auto" unmountOnExit className="test">
                {
                    props.items.map((item: IDropdownListItem, index: number) => {
                        const dropDownListItemClass = clsx('dropdown-list-item', {
                            'dropdown-list-item_available': item.available,
                            'dropdown-list-item_not-available': !item.available,
                        });

                        const dropDownListItemProgressClass = clsx('dropdown-list-item__progress', {
                            'dropdown-list-item__progress_active': item.checked,
                            'dropdown-list-item__progress_inactive': !item.checked,
                        });

                        const dropDownListItemLineClass = clsx('dropdown-list-item__line', {
                            'dropdown-list-item__line_active': item.checked,
                            'dropdown-list-item__line_inactive': !item.checked,
                        });

                        return (
                            <div
                                className={dropDownListItemClass}
                                key={item.title}
                            >
                                <div className={dropDownListItemProgressClass} style={!expanded ? { display: 'none' } : { display: 'flex' }}>
                                    {
                                        item.checked ?
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
                                        <span className="dropdown-list-item__title">{item.title}</span>
                                    </div>
                                    <span className="dropdown-list-item__time">{timeConversion(item.time)}</span>

                                </div>
                            </div>
                        )
                    })
                }
            </Collapse>
        </div>
    )
}

export default DropdownList;