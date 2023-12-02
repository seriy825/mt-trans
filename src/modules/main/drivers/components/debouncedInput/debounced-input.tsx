import clsx from 'clsx'
import React, {ChangeEvent} from 'react'
import {Input} from 'shared/components/input/input'

const DebouncedInputComponent = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Input
      placeholder={props.placeholder}
      value={value}
      onChange={handleChange}
      className={clsx('border border-primary',props.className)}
    />
  )
}

export const DebouncedInput = React.memo(DebouncedInputComponent)
