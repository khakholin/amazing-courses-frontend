import React, { ReactNode } from 'react';
import clsx from 'clsx';

import './bGContentStyle.scss';

export interface IBGContent {
    children?: ReactNode;
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
            <div className={bgContentTitleClass}>{props.title}</div>
            {props.children}
        </div>
    )
}

export default BGContent;