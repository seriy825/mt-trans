import React, { forwardRef, useState } from 'react';
import { Icon } from '../icon/icon';
import { ICON_COLLECTION } from '../icon/icon-list';
import { Input, InputProps } from './input';
import styles from './password-input.module.scss'

type PasswordInputProps = InputProps;

export const RootPasswordInput: React.ForwardRefRenderFunction<
	HTMLInputElement,
	PasswordInputProps
> = (props, ref) => {
	const [isDisplayedPassword, setIsDisplayedPassword] = useState(false);
	const toggleShowPassword = () =>
		setIsDisplayedPassword((prevValue) => !prevValue);

	const InputButton = (
		<button onClick={toggleShowPassword} type="button" className={styles.icon}>
			<Icon icon={isDisplayedPassword ? ICON_COLLECTION.hidePassword : ICON_COLLECTION.showPassword}/>
		</button>
	);

	return (
		<Input
			ref={ref}
			type={isDisplayedPassword ? 'text' : 'password'}
			endAdornment={InputButton}
			{...props}
		/>
	);
};

export const PasswordInput = forwardRef(RootPasswordInput);
