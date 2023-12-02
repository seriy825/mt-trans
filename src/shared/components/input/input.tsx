import * as React from 'react'
import {forwardRef, InputHTMLAttributes, useId, useState, FocusEvent} from 'react'
import {Form, FormControlProps, InputGroup} from 'react-bootstrap'
import styles from './input.module.scss'
import clsx from 'clsx'

type modeType = 'number' | 'large'

export interface InputProps {
    value?: string | number
    disabled?: FormControlProps['disabled']
    className?: string
    type?: InputHTMLAttributes<HTMLInputElement>['type']
    autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete']
    readOnly?: InputHTMLAttributes<HTMLInputElement>['readOnly']
    placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder']
    error?: boolean
    errorText?: React.ReactNode
    step?:number
    startAdornment?: React.ReactNode
    endAdornment?: React.ReactNode
    mode?:modeType
    min?:number
    max?:number
    name?: InputHTMLAttributes<HTMLInputElement>['name']
    autoFocus?: InputHTMLAttributes<HTMLInputElement>['autoFocus']
    tabIndex?: InputHTMLAttributes<HTMLInputElement>['tabIndex']
    onClick?: InputHTMLAttributes<HTMLInputElement>['onClick']
    onChange?: InputHTMLAttributes<HTMLInputElement>['onChange']
    onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur']
    onFocus?: InputHTMLAttributes<HTMLInputElement>['onFocus']
}

const RootInput: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    {
        value,
        disabled = false,
        className,
        type = 'text',
        autoComplete,
        readOnly,
        placeholder,
        error,
        errorText,
        startAdornment,
        endAdornment,
        name,
        step,
        min,
        max,
        autoFocus,
        mode,
        tabIndex,
        onClick,
        onChange,
        onBlur,
        onFocus
    },
    ref
) => {
    const id = useId()

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus && onFocus(event)
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur && onBlur(event)
    };

    return (
        <>
            <InputGroup className={clsx(error && styles.hasError, styles.inputGroup,className,
                {[styles['inputGroup--focused']]: isFocused})}>
                {startAdornment && (
                    <InputGroup.Text className={clsx(styles.icon, styles.formControl)}>
                        {startAdornment}
                    </InputGroup.Text>
                )}
                <Form.Control
                    ref={ref}
                    id={id}
                    className={clsx(styles.input, styles.formControl,{[styles[`input--${mode}`]]: mode,})}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    min={min}
                    max={max}
                    step={step||'any'}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    readOnly={readOnly}
                    tabIndex={tabIndex}
                    onClick={onClick}
                    onChange={onChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
                {endAdornment && (
                    <InputGroup.Text className={clsx(styles.icon, styles.formControl)}>
                        {endAdornment}
                    </InputGroup.Text>
                )}
            </InputGroup>
            {error && errorText && (
                <Form.Control.Feedback className={styles.error} type='invalid'>
                    {errorText}
                </Form.Control.Feedback>
            )}
        </>
    )
}

export const Input = forwardRef(RootInput)
