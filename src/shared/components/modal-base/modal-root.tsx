import * as React from 'react';
import ExternalModal from 'react-bootstrap/Modal';
import {ModalContext} from 'shared/components/modal-base';
import styles from './modal.module.scss'

interface ModalProps {
    open: boolean;
    onClose: () => void;
    isClosable?: boolean;
}

export const ModalRoot: React.FC<React.PropsWithChildren<ModalProps>> = ({
                                                                             open,
                                                                             isClosable = true,
                                                                             onClose,
                                                                             children,
                                                                         }) => {
    const handleClose = () => {
        if (!isClosable) {
            return;
        }
        onClose();
    };

    return (
        <ExternalModal show={open} onHide={isClosable ? onClose : undefined} centered keyboard = {isClosable} >
            <ModalContext.Provider value={{onClose: handleClose}}>
                <div className={styles['modal-body']}>{children}</div>
            </ModalContext.Provider>
        </ExternalModal>
    );
};
