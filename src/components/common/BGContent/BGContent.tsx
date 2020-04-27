import React, { ReactNode } from 'react';

import './bGContentStyle.scss';

export interface IBGContent {
    children?: ReactNode;
    title?: string
}

const BGContent = (props: IBGContent) => {
    return (
        <div
            className="bg-content"
        >
            <div className="bg-content__title">{props.title}</div>
            {props.children}
        </div>
    )
}

export default BGContent;