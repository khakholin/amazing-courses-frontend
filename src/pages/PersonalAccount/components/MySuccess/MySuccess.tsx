import React from 'react';

import './mySuccessStyle.scss';

export interface IMySuccessProps {
}

const MySuccess = (props: IMySuccessProps) => {
    return (
        <div className="my-success-component">
            прогресс-бары со статусами прохождения курсов
        </div>
    );
};

export default MySuccess;
