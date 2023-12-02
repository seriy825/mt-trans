import React from 'react'
import {Outlet} from 'react-router-dom'
import {Sidebar} from './components/Sidebar'
import styles from './layout.module.scss'
import clsx from 'clsx'
const MainLayout: React.FC = () => {
  return (
    <div className='d-flex bg-light h-100'>
      <Sidebar />
      <div className={clsx(' w-100',styles.layout)}>
        <Outlet />
      </div>
    </div>
  )
}

export {MainLayout}
