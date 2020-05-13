import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Fragment, ReactNode, useEffect, useState } from 'react';

import './loaderStyle.scss';

export interface ILoaderProps {
    children?: ReactNode;
    message?: string;
}

export interface IConnectedProps {
    showLoader: boolean;
    textLoader?: string;
}

type TLoaderProps = ILoaderProps & IConnectedProps;

let timer: number;

export const Loader = (props: TLoaderProps) => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        timer = setTimeout(() => {
            setShow(true);
        });
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        props.showLoader ?
            <div className="loader">
                {show ?
                    <Fragment>
                        <CircularProgress
                            className="loader__spinner"
                            size={100}
                            thickness={3}
                        />
                        <div className="loader__text">{props.textLoader}</div>
                    </Fragment>
                    : null
                }
            </div>
            :
            <Fragment>{props.children}</Fragment>
    );
};

export default Loader;
