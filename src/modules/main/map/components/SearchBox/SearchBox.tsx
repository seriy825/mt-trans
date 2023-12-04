import React from 'react'
import {StandaloneSearchBox} from '@react-google-maps/api'
import {Button} from 'shared/components/button/button'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'
import {Input} from 'shared/components/input/input'
import styles from './searchBox.module.scss'
import {Dropdown, DropdownButton} from 'react-bootstrap'
import {IDriver} from 'shared/types/api-types/driver'
import {DistanceCalculator} from 'shared/utils/DistanceCalculator'
import clsx from 'clsx'

interface ISearchBoxComponent {
  drivers: IDriver[]
  searchValue?: string
  miles?: number
  findedPlace: google.maps.places.PlaceResult
  bounds: google.maps.LatLngBounds
  onSearchBarLoad: (ref: google.maps.places.SearchBox) => void
  onPlacesChanged: () => void
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearchClear: () => void
  onMilesChange: (
    miles: number
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const SearchBoxComponent: React.FC<ISearchBoxComponent> = (props) => {
  const {
    drivers,
    findedPlace,
    searchValue,
    bounds,
    miles,
    onPlacesChanged,
    onSearchBarLoad,
    onSearchChange,
    onSearchClear,
    onMilesChange,
  } = props

  const findedPlaceLocation = findedPlace
    ? {
        lat: findedPlace.geometry.location.lat(),
        lng: findedPlace.geometry.location.lng(),
      }
    : null

  const onCopyClick =
    (driver: IDriver) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const distance = `${DistanceCalculator(
        {lat: driver.position[0], lng: driver.position[1]},
        findedPlaceLocation
      ).toFixed(2)} mi.`
      const text = `Rate: $\r\nMiles out: ${distance}\r\nDimension: ${driver.dimension}\r\nLocation: ${driver.locationName}`
      navigator.clipboard.writeText(text)
    }

  const onTelegramClick =
    (telegram: string) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const url = `https://t.me/${telegram}`
      window.open(url, '_blank')
    }

  const distance = (driver: IDriver) => {
    return `${DistanceCalculator(
      {lat: driver.position[0], lng: driver.position[1]},
      findedPlaceLocation
    ).toFixed(2)} mi.`
  }

  return (
    <StandaloneSearchBox
      onLoad={onSearchBarLoad}
      onPlacesChanged={onPlacesChanged}
      bounds={bounds}
    >
      <div className='position-relative'>
        <div className={styles.searchBoxWrapper}>
          <div className={styles.searchBox}>
            <Input
              type='text'
              placeholder='Enter location'
              value={searchValue}
              onChange={onSearchChange}
              endAdornment={
                <Button
                  label={
                    <Icon icon={ICON_COLLECTION.clear} mode={'clickable'} />
                  }
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
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(100)}
                active={miles === 100}
              >
                100 Miles
              </Dropdown.Item>
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(200)}
                active={miles === 200}
              >
                200 Miles
              </Dropdown.Item>
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(300)}
                active={miles === 300}
              >
                300 Miles
              </Dropdown.Item>
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(400)}
                active={miles === 400}
              >
                400 Miles
              </Dropdown.Item>
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(500)}
                active={miles === 500}
              >
                500 Miles
              </Dropdown.Item>
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(600)}
                active={miles === 600}
              >
                600 Miles
              </Dropdown.Item>
              <Dropdown.Item
                as={'button'}
                onClick={onMilesChange(700)}
                active={miles === 700}
              >
                700 Miles
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <div className={styles.searchList}>
            {findedPlace && drivers.length
              ? drivers.map((driver) => (
                  <div key={driver.id} className={styles.driverCard}>
                    <div>
                      <h5>{`${driver.id} ${driver.name}`}</h5>
                      <p className='m-0 mb-2'>
                        Location: {driver.locationName}
                      </p>
                      <p className='m-0 mb-2'>Dimension: {driver.dimension}</p>
                      <p className='m-0 mb-2'>Capacity: {driver.capacity}</p>
                      <p className='m-0 mb-2'>Status: {driver.status}</p>
                      <p className='m-0 mb-2'>
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
                    <div className='d-flex justify-content-between flex-column align-items-end'>
                      <div>
                        <h5 className='fw-bold'>
                          {driver?.distance?.toFixed(2)} mi.
                        </h5>
                        <h4 className='fw-bold'>{}</h4>
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
                          {driver.typeCar}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </StandaloneSearchBox>
  )
}

export const SearchBox = React.memo(SearchBoxComponent)
