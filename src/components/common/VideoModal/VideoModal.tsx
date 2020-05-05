import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';

import './videoModalStyle.scss';

export interface IVideoModal {
    closeHandler: () => void;
    isOpen: boolean;
    title: string;
}

const VideoModal = (props: IVideoModal) => {
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
                    <div className="video-modal-content__title">{props.title}</div>
                    <div className="video-modal-content__border video-modal-content__border_top"></div>
                    <video className="video-modal-content__video" src={require('../../../trimmed.mp4')} controls />
                    <div className="video-modal-content__border video-modal-content__border_bottom"></div>
                </div>
            </Fade>
        </Modal>
    );
};

export default VideoModal;
