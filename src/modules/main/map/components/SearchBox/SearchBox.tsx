import React from 'react'
import {Button} from 'shared/components/button/button'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'
import {Input} from 'shared/components/input/input'
import styles from './searchBox.module.scss'
import {Dropdown, DropdownButton} from 'react-bootstrap'
import {IDriver} from 'shared/types/api-types/driver'
import clsx from 'clsx'
import {MILES_FILTERS} from 'shared/constants/filters'
import {isValidUrl} from 'shared/helpers/validate-url-string'
import { MapboxFeature } from 'app/api/driver-api/driver-api'
import { formatHours } from 'shared/helpers/hoursFormatter'

interface ISearchBoxComponent {
  drivers: IDriver[]
  searchValue?: string
  miles?: number
  findedPlace: MapboxFeature
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearchClear: () => void
  onSearch: () => void
  onMilesChange: (
    miles: number
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const SearchBoxComponent: React.FC<ISearchBoxComponent> = (props) => {
  const {
    drivers,
    findedPlace,
    searchValue,
    miles,
    onSearch,
    onSearchChange,
    onSearchClear,
    onMilesChange,
  } = props

  const onCopyClick =
    (driver: IDriver) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const text = `Rate: $\r\nMiles out: ${driver?.distance?.toFixed(
        2
      )} mi.\r\nDimension: ${driver.dimension}\r\nLocation: ${
        driver.locationName
      }`
      navigator.clipboard.writeText(text)
    }

  const onTelegramClick =
    (telegram: string) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const url = isValidUrl(telegram) ? telegram : `https://t.me/${telegram}`
      window.open(url, '_blank')
    }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className='position-relative'>
      <div className={styles.searchBoxWrapper}>
        <div className={styles.searchBox}>
          <Input
            type='text'
            placeholder='Enter location'
            value={searchValue}
            onKeyDown={handleKeyPress}
            onChange={onSearchChange}
            endAdornment={
              <Button
                label={<Icon icon={ICON_COLLECTION.clear} mode={'clickable'} />}
                mode='text'
                onClick={onSearchClear}
              />
            }
          />
          <DropdownButton
            id='dropdown-basic-button'
            variant='Secondary'
            menuVariant='dark'
            title={<Icon icon={ICON_COLLECTION.filter} mode={'clickable'} />}
          >
            {MILES_FILTERS.map((filter) => (
              <Dropdown.Item
                key={filter.value}
                as={'button'}
                onClick={onMilesChange(filter.value)}
                active={miles === filter.value}
              >
                {filter.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <div className={styles.searchList}>
          {findedPlace ?
           drivers?.length
            ? drivers.map((driver) => (
                <div key={driver.id} className={styles.driverCard}>
                  <div className={styles['driverCard--info']}>
                    <h6>{`${driver.id} ${driver.name}`}</h6>
                    <p className='m-0'>Location: {driver.locationName}</p>
                    <p className='m-0'>Dimension: {driver.dimension}</p>
                    <p className='m-0'>Capacity: {driver.capacity}</p>
                    <p className='m-0'>Status: {driver.status}</p>
                    <p className='m-0'>
                      Phone: {driver.phone ? driver.phone : '---'}
                    </p>
                    {driver.telegram && <p>Telegram: {driver.telegram}</p>}
                    {driver.note && <p>Note: {driver.note}</p>}
                    {driver.dateAvailable &&
                      new Date(driver.dateAvailable) > new Date() && (
                        <span className={styles.available}>
                          Available:{' '}
                          {new Date(driver.dateAvailable).toLocaleDateString(
                            'en-us',
                            {hour: '2-digit', minute: '2-digit'}
                          )}
                        </span>
                      )}
                  </div>
                  <div
                    className={clsx(
                      'd-flex justify-content-between flex-column align-items-end',
                      styles['driverCard--distance']
                    )}
                  >
                    <div>
                      <h5 className='fw-bold'>
                        {driver.distance || driver.distance === 0
                          ? `${driver?.distance.toFixed(0)} mi.`
                          : '--'}
                      </h5>
                      <h5 className={clsx('fw-bold ')}>
                        {driver.hours ? `~${formatHours(driver?.hours)}` : '--'}
                      </h5>
                    </div>
                    <div className={styles['driverCard--actions']}>
                      <Button
                        label={
                          <Icon
                            icon={ICON_COLLECTION.copy}
                            mode={'clickable'}
                          />
                        }
                        mode='text'
                        onClick={onCopyClick(driver)}
                      />
                      {driver.telegram && (
                        <Button
                          label={
                            <Icon
                              icon={ICON_COLLECTION.telegram}
                              mode={'clickable'}
                            />
                          }
                          mode='text'
                          onClick={onTelegramClick(driver.telegram)}
                        />
                      )}

                      <span
                        className={clsx(`py-0 px-2`, [
                          styles[`type--${driver.typeCar.replace(' ', '')}`],
                        ])}
                      >
                        {driver.typeCar === 'box truck'
                          ? 'Small straight'
                          : driver.typeCar}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            : <p className='p-0 m-0 d-flex align-items-center justify-content-center'>No cars founded with this filters.</p> : null}
        </div>
      </div>
    </div>
  )
}

export const SearchBox = React.memo(SearchBoxComponent)
