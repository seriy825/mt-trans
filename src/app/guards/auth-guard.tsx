/* eslint-disable react-hooks/rules-of-hooks */
// @ts-ignore
import * as React from 'react'
import {selectIsLoggedIn} from '../store/auth/selects'
import {AUTH_ROUTES, MAIN_ROUTES} from '../../shared/config/routes'
import {Navigate, useLocation} from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const AuthGuard: React.FC<React.PropsWithChildren> = ({children}) => {
  // eslint-disable-next-line react/display-name
  const isAuth = selectIsLoggedIn()
  const location = useLocation()

  const isAuthPage = location.pathname.startsWith(AUTH_ROUTES.ROOT.path)
  if (!isAuth && !isAuthPage) {
    return (
      <Navigate to={AUTH_ROUTES.ROOT.path} state={{from: location}} replace />
    )
  }

  if (isAuthPage && isAuth) {
    return <Navigate to={MAIN_ROUTES.MAP.path} replace />
  }
  return children || null
}
