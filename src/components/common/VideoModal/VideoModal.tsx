import React, { useState, useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';

import './videoModalStyle.scss';
import { appRequestFile } from '../../../modules/app/appRequest';

export interface IVideoModal {
    closeHandler: () => void;
    isOpen: boolean;
    lectureTitle: string;
    lectureNumber: number | undefined;
    lectureFolder: string;
}

const VideoModal = (props: IVideoModal) => {
    const [videoData, setVideoData] = useState();
    useEffect(() => {
        appRequestFile('/api/course/video/' + props.lectureFolder + '/' + props.lectureNumber, 'GET')
            .then(response => {
                const reader = new FileReader()
                reader.readAsDataURL(response.data);
                reader.onload = (event: any) => {
                    const result = event?.target.result;
                    setVideoData(result);
                }

            });
        // eslint-disable-next-line
    }, [])
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
                    <div className="video-modal-content__title">{props.lectureTitle}</div>
                    <div className="video-modal-content__border video-modal-content__border_top"></div>
                    <video className="video-modal-content__video" src="http://khakholin.ru/api/course/video/Course1/1" controls />
                    <div className="video-modal-content__border video-modal-content__border_bottom"></div>
                </div>
            </Fade>
        </Modal>
    );
};

export default VideoModal;
