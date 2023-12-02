import React, {useState, useEffect} from 'react'
import styles from './timezones.module.scss'

const TimeDisplay = () => {
  const [estTime, setESTTime] = useState('')
  const [centralTime, setCentralTime] = useState('')
  const [pacificTime, setPacificTime] = useState('')

  useEffect(() => {
    const updateTimes = () => {
      const est = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })
      const central = new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago',
      })
      const pacific = new Date().toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
      })

      setESTTime(est)
      setCentralTime(central)
      setPacificTime(pacific)
    }

    const interval = setInterval(updateTimes, 1000)
    updateTimes()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.timezones}>
      <h3 className={styles['timezones--header']}>Current Time</h3>
      <p className={styles['timezones--time']}>
        <span>Eastern Time (EST): </span>
        <span>{estTime}</span>
      </p>
      <p className={styles['timezones--time']}>
        <span>Central Time: </span>
        <span>{centralTime}</span>
      </p>
      <p className={styles['timezones--time']}>
        <span>Pacific Time: </span>
        <span>{pacificTime}</span>
      </p>
    </div>
  )
}

export default TimeDisplay
