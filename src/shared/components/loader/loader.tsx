import React from 'react';
import styled from './loader.module.scss'
import clsx from "clsx";

interface ILoader {
    mode?: 'blur',
    className?: string
}

export const Loader: React.FC<ILoader> = ({mode,className}) => {
    return (
        <div className={clsx([styled.loader, className,
            styled[`loader--${mode}`]])}>
            <div className="spinner-border text-exl-primary" role="status">
            </div>
        </div>
    );
};

