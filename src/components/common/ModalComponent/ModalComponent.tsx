import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';

import './modalComponentStyle.scss';
import BGContent from '../BGContent/BGContent';

export interface IModalComponent {
    closeHandler: () => void;
    error?: boolean;
    isOpen: boolean;
    text: string;
    title: string;
}

const ModalComponent = (props: IModalComponent) => {
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            className='modal'
            closeAfterTransition
            open={props.isOpen}
            onClose={props.closeHandler}
        >
            <Fade style={{ outline: 'none' }} in={props.isOpen}>
                <BGContent
                    error={props.error}
                    title={props.title}
                >
                    {props.text}
                </BGContent>
            </Fade>
        </Modal>
    );
};

export default ModalComponent;
