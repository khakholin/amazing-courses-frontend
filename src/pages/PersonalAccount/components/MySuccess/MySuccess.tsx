import React, { Fragment } from 'react';

import './mySuccessStyle.scss';
// import { appRequest } from '../../../../modules/app/appRequest';
// import { endpoints } from '../../../../constants/endpoints';
// import { IUserCoursesData } from '../../../../types/inputPropsFormats';

export interface IMySuccessProps {
    availableCourses: string[] | undefined;
}

const MySuccess = (props: IMySuccessProps) => {
    // const [dataList, setDataList] = useState<IUserCoursesData>();
    // useEffect(() => {
    //     appRequest(endpoints.getCourses, 'POST', { availableCourses: props.availableCourses })
    //         .then((response) => {
    //             setDataList(response.data)
    //         });
    // }, [])
    return (
        <Fragment>
            <div className="personal-account-info-header">
                <div className="personal-account-info-header__title">Успехи</div>
                <div className="personal-account-info-header__description">Прогресс прохождения курсов</div>
            </div>
            <div className="my-success-component personal-account-info-body">
                прогресс-бары со статусами прохождения курсов
            </div>
        </Fragment>
    );
};

export default MySuccess;
