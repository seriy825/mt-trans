import React, {useMemo} from 'react'
import {IDriver} from 'shared/types/api-types/driver'
import styles from './drivers-table.module.scss'
import {DebouncedInput} from '../debouncedInput/debounced-input'
import {Button} from 'shared/components/button/button'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'
import './drivers-table.scss'

interface IDriversTableComponent {
  drivers: IDriver[] | []
  updatingActiveStatusDriverId:number
  onActivate: (
    driver: IDriver
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onDeactivate: (
    driver: IDriver
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCreateClick: () => void
  onEditClick: (
    driver: IDriver
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const DriversTableComponent: React.FC<IDriversTableComponent> = (
  props: IDriversTableComponent
) => {
  const {drivers, updatingActiveStatusDriverId, onActivate, onDeactivate, onEditClick, onCreateClick} = props
  const [globalFilter, setGlobalFilter] = React.useState('')
  const filteredDrivers = useMemo(() => {
    if (!globalFilter) return drivers
    return drivers.filter(
      (driver) =>
        driver.id.toString().includes(globalFilter.toLowerCase()) || driver.name.toLowerCase().includes(globalFilter.toLowerCase())
    )
  }, [drivers, globalFilter,updatingActiveStatusDriverId])
  return (
    <div className={styles.table}>
      <div className='d-flex align-items-center justify-content-between'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(`${value}`)}
          className='p-1 font-lg shadow border border-block w-25'
          placeholder='Search by id or name...'
        />
        <Button
          label='Create'
          type='button'
          mode='text'
          onClick={onCreateClick}
        />
      </div>
      <table className='table table-hover table-striped'>
        <thead className='table-light'>
          <tr>
            <th>Available</th>
            <th>Id</th>
            <th>Name</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Dimension</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Date Available</th>
            <th>Note</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.length ? (
            filteredDrivers.map((driver) => (
              <tr key={driver.id}>
                <td className='text-center'>
                  {driver.active ? (
                    <Button
                      type='button'
                      mode='text'
                      label={<Icon icon={ICON_COLLECTION.activate} />}
                      onClick={onDeactivate(driver)}
                      isLoading={updatingActiveStatusDriverId===driver.id}
                    />
                  ) : (
                    <Button
                      type='button'
                      mode='text'
                      label={<Icon icon={ICON_COLLECTION.deactivate} />}
                      onClick={onActivate(driver)}
                      isLoading={updatingActiveStatusDriverId===driver.id}
                    />
                  )}
                </td>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.typeCar}</td>
                <td>{driver.phone}</td>
                <td>{driver.dimension}</td>
                <td>{driver.capacity}</td>
                <td>{driver.locationName}</td>
                <td>
                  {new Date(driver.dateAvailable).toLocaleDateString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  {driver.note ? (
                    driver.note
                  ) : (
                    <span className='d-flex align-items-center justify-content-center'>
                      ---
                    </span>
                  )}
                </td>
                <td className='text-center'>
                  <Button
                    type='button'
                    mode='text'
                    label={<Icon icon={ICON_COLLECTION.edit} />}
                    onClick={onEditClick(driver)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className='text-muted text-center'>
                No drivers was found with this filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export const DriversTable = React.memo(DriversTableComponent)
