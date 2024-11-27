import React from 'react';

import {ModalRoot} from 'shared/components/modal-base/modal-root';

export interface ModalContextProps {
    onClose: () => void;
}

export const ModalContext = React.createContext<ModalContextProps>({
    onClose: () => false,
});

export const Modal = {
    Root: ModalRoot,

};
