/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {useFormik, FormikProps} from 'formik'
import styles from './Login.module.scss'
import {useAuth} from 'modules/auth/hooks/use-auth'
import {Input} from 'shared/components/input/input'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'
import {PasswordInput} from 'shared/components/input/password-input'
import { Button } from 'shared/components/button/button'

const initialValues = {
  email: '',
  password: '',
}

export interface IFormikProps {
  email: string
  password: string
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

export function Login() {
  const {loginMutation, error} = useAuth()
  const handleSubmit = (values: IFormikProps) => {
    loginMutation.mutate(values)
  }
  const formik: FormikProps<IFormikProps> = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      handleSubmit(values)
    },
  })
  return (
    <form
      className='mx-auto p-5 rounded border bg-light'
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <div className='text-center'>
        <h1
          className={clsx(
            'fw-bolder mb-3',
            styles.header,
            styles.textPrimaryDark
          )}
        >
          MT Trans
        </h1>
      </div>
      {(formik.status || error) && (
        <div className='mb-3 alert alert-danger'>
          <div className='text-center font-weight-bold'>{error}</div>
        </div>
      )}
      <div className='d-flex flex-column gap-3'>
        <div>
          <Input
            placeholder={'Enter email...'}
            {...formik.getFieldProps('email')}
            type='email'
            name='email'
            autoComplete='on'
            error={formik.touched.email && !!formik.errors.email}
            errorText={formik.errors.email}
            disabled={loginMutation.isLoading}
            startAdornment={<Icon icon={ICON_COLLECTION.user} />}
          />
        </div>
        <div>
          <PasswordInput
            placeholder={'Enter password...'}
            startAdornment={<Icon icon={ICON_COLLECTION.key} />}
            className='pe-2'
            {...formik.getFieldProps('password')}
            autoComplete='off'
            error={formik.touched.password && !!formik.errors.password}
            errorText={formik.errors.password}
            disabled={loginMutation.isLoading}
          />
        </div>
        <div>
          <Button
            label={'Sign in'}
            mainButton
            className='w-100'
            type='submit'
            disabled={formik.isSubmitting || !formik.isValid || loginMutation.isLoading}
            isLoading={loginMutation.isLoading}
          />
        </div>
      </div>
    </form>
  )
}
