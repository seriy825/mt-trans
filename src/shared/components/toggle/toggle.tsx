import React from 'react'
import styles from './toggle.module.scss'
import clsx from 'clsx'

interface IToggleProps {
  isActive: boolean
  setActive: () => void
  disabled?: boolean
}

const ToggleComponent: React.FC<IToggleProps> = ({
  isActive,
  setActive,
  disabled = false,
}) => {
  return (
    <div
      className={clsx(styles.toggle, {[styles['toggle--disabled']]: disabled})}
      onClick={!disabled ? setActive : undefined}
    >
      <button
        type='button'
        disabled={disabled}
        className={clsx(styles.toggle__button, {
          [styles['toggle__button--disable']]: !isActive,
        })}
      ></button>
      <button
        disabled={disabled}
        type='button'
        className={clsx(styles.toggle__button, {
          [styles['toggle__button--active']]: isActive,
        })}
      ></button>
    </div>
  )
}
export const Toggle = React.memo(ToggleComponent)
