/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {Outlet} from 'react-router-dom'
import {Login} from './pages/login/Login'
import {AUTH_ROUTES} from 'shared/config/routes'
import {AuthGuard} from 'app/guards/auth-guard'

const AuthLayout = () => {
  return (
    <div className='h-100 d-flex align-items-center justify-content-center'>
        <Outlet />
    </div>
  )
}

const AuthPage = [
  {
    path: AUTH_ROUTES.ROOT.path,
    element: (
      <AuthGuard>
        <AuthLayout />
      </AuthGuard>
    ),
    children: [
      {path: AUTH_ROUTES.LOGIN.path, element: <Login />},
      {path: AUTH_ROUTES.ROOT.path, element: <Login />},
    ],
  },
]

export {AuthPage}
