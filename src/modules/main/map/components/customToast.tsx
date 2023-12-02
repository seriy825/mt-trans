import React from 'react'
import { IDriver } from 'shared/types/api-types/driver'

interface ICustomToast{
    text?:string
    driver:IDriver
}

export const CustomToast:React.FC<ICustomToast> = (props:ICustomToast) => {
    const {text, driver} = props
    return (
        <div>
            <h5>{text}</h5>
            <p className='m-0'>Unit #{driver.id}</p>
            <p className='m-0'>Name {driver.name}</p>
        </div>
    )
}