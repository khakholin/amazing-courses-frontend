import React from 'react';

import './personalAreaStyle.scss';

export interface IPersonalArea { };

const PersonalArea = (props: IPersonalArea) => {
    return (
        <div className="personal-area">
            PERSONAL AREA
        </div>
    );
};

export default PersonalArea;
