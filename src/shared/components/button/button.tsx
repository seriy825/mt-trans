import * as React from 'react'
import {ButtonHTMLAttributes, forwardRef, ReactElement} from 'react'
import Spinner from 'react-bootstrap/Spinner'
import styles from './button.module.scss'
import clsx from "clsx";

type modeType = 'text' | 'small' | 'remove' | 'navbar'

export interface ButtonProps {
    component?: React.ElementType
    className?: string
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
    label: string | ReactElement
    isLoading?: boolean
    disabled?: boolean
    id?:string
    mainButton?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    mode?: modeType
}

const ButtonRoot: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
    {component, className, type, label, id, isLoading, disabled, mainButton, mode, onClick},
    ref
) => {
    return (
        <button
            ref={ref}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            component={component}
            id={id}
            type={type}
            className={clsx(styles.btn,
                {
                    [styles['btn--main']]: mainButton,
                    [styles['btn--secondary']]: !mainButton,
                    [styles[`btn--${mode}`]]: mode,

                }, className,
            )}
            disabled={disabled}
            onClick={onClick}
        >
            {isLoading ? (
                <Spinner variant={'dark'} size={'sm'}/>
            ) : (
                <span>{label}</span>
            )}
        </button>
    )
}

export const Button = forwardRef(ButtonRoot)
