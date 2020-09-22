import React, { Fragment, useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import TouchAppIcon from '@material-ui/icons/TouchApp';

import './videoModalStyle.scss';

export interface IVideoModal {
    closeHandler: () => void;
    isOpen: boolean;
    lectureTitle: string;
    lectureNumber: number | undefined;
    lectureFolder: string;
    lectureAdditional: any;
}

const VideoModal = (props: IVideoModal) => {
    useEffect(() => {
        console.log(props.lectureAdditional);
        // eslint-disable-next-line
    }, []);

    return (
        <Modal
            aria-labelledby="video-modal-title"
            aria-describedby="video-modal-description"
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            className='video-modal'
            closeAfterTransition
            open={props.isOpen}
            onClose={props.closeHandler}
        >
            <Fade style={{ outline: 'none' }} in={props.isOpen}>
                <div className="video-modal-content">
                    <div>
                        <div className="video-modal-content__title">{props.lectureTitle}</div>
                        <video className="video-modal-content__video" src="http://khakholin.ru/api/course/video/Course1/1" controls />
                    </div>
                    {props.lectureAdditional?.length ?
                        <div className="video-modal-materials">
                            <div className="video-modal-materials__title">
                                Дополнительные материалы:
                            </div>
                            {
                                props.lectureAdditional?.map((material: any) => {
                                    return (
                                        <div className="video-modal-materials__item">
                                            <TouchAppIcon className="video-modal-materials__item-icon" />
                                            <a className="video-modal-materials__item-link" href={material.materialLink} target='_blank' rel="noopener noreferrer">{material.materialTitle}</a>
                                        </div>
                                    )
                                })
                            }
                        </div> : <Fragment />
                    }
                </div>
            </Fade>
        </Modal>
    );
};

export default VideoModal;
