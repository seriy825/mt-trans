import * as React from 'react';
import styles from './icon.module.scss'
import {IconCollectionType} from './icon-list';
import clsx from 'clsx';

type IconMode = 'clickable'

interface IconProps {
    className?: string;
    icon: IconCollectionType;
    mode?:IconMode;
}


export const Icon: React.FC<IconProps> = ({ className, icon, mode }) => {
    const Component = icon;

    return (
        <span className={clsx(`${styles.icon}`,
                                {
                                    [className]: className,
                                    [styles[`icon--${mode}`]]: mode,
                                },
                             )}
        >
            <Component />
        </span>
    );
};
