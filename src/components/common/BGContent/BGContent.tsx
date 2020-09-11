import React, { ReactNode } from 'react';
import clsx from 'clsx';
import ClearIcon from '@material-ui/icons/Clear';

import './bGContentStyle.scss';

export interface IBGContent {
    children?: ReactNode;
    closeHandler?: () => void;
    error?: boolean;
    title?: string
}

const BGContent = (props: IBGContent) => {
    const bgContentTitleClass = clsx('bg-content__title', {
        'bg-content__title_error': props.error,
    });

    return (
        <div
            className="bg-content"
        >
            {
                props?.closeHandler && <ClearIcon
                    className="bg-content__icon-close"
                    onClick={() => props?.closeHandler && props?.closeHandler()}
                />
            }
            <div className={bgContentTitleClass}>{props.title}</div>
            {props.children}
        </div>
    )
}

export default BGContent;