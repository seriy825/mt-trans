import React from 'react'
import {useAppNavigationContext} from 'shared/context/app-navigation-context'
import styles from './sidebar.module.scss'
import {Link, useLocation} from 'react-router-dom'
import clsx from 'clsx'
import {ILink} from 'shared/types/base'
import { useLogout } from 'modules/auth/hooks/use-logout'
import { MAIN_ROUTES } from 'shared/config/routes'
import Logo from 'assets/icons/icon.png'
import TimeDisplay from 'modules/main/timezones/timezones'

export const Sidebar: React.FC = () => {
  const {navigationLinks} = useAppNavigationContext()
  const location = useLocation()
  const {logout} = useLogout()
  const isActive = (link: ILink) => {
    return location.pathname.includes(link.path)
  }
  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.sidebar__header}>
          <img src={Logo} width={150} height={150} alt='Logo'/>
        </div>
        <div className={styles.sidebar__links}>
          {navigationLinks.map((link) => (
            <Link
              key={link.title}
              className={clsx(styles.sidebar__link, {[styles.active]: isActive(link)})}
              to={link.path}
              onClick={link.title===MAIN_ROUTES.LOGOUT.title && logout}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
      <TimeDisplay/>
    </div>
  )
}
