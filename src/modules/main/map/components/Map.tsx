import React from 'react'
import {Circle, GoogleMap} from '@react-google-maps/api'
import styles from './map.module.scss'
import {IDriver} from 'shared/types/api-types/driver'
import {Marker} from './Marker/Marker'
import {useMapPage} from '../useMapPage'
import {CENTER_POINT} from 'shared/constants/center'
import {ThemeDropdown} from './themeDropdown/themeDropdown'
import {SearchBox} from './SearchBox/SearchBox'
import { Loader } from 'shared/components/loader/loader'

const containerStyle = {
  width: '100%',
  height: '90vh',
}

export const Map = () => {
  const {models, commands} = useMapPage()

  return (
    <div className={styles.wrapper}>
      {models.isDriversFiltering && <Loader/>}
      <div className='d-flex justify-content-end'>
        <ThemeDropdown
          activeTheme={models.activeTheme}
          onChangeTheme={commands.handleChangeTheme}
        />
      </div>
      <div className={styles['google-map']}>        
        <SearchBox
          findedPlace={models.findedPlace}
          drivers={models.drivers}
          searchValue={models.searchValue}
          miles={models.milesFilter}
          bounds={models.bounds}
          onPlacesChanged={commands.onPlacesChanged}
          onSearchBarLoad={commands.onSearchBarLoad}
          onSearchChange={commands.onSearchChange}
          onSearchClear={commands.onSearchClear}
          onMilesChange={commands.onMilesChange}
        />
        <GoogleMap
          mapContainerStyle={containerStyle}
          mapContainerClassName={styles['google-map']}
          center={CENTER_POINT}
          zoom={5}
          options={{
            mapTypeControl: false,
            disableDefaultUI: true,
            styles: models.theme,
          }}
          onClick={commands.onClickMap}
        >
          {models.circle.circleCenter && (
            <>
              <Circle                
                onClick={commands.onClickMap}
                center={models.circle.circleCenter}
                radius={models.circle.circleRadius}
                options={models.circle.circleOptions}
              />
              <Marker position={models.circle.circleCenter} isCircleMarker/>
            </>
          )}
          {models.drivers.map((driver: IDriver) => {
            return (
              <Marker
                key={driver.id}
                marker={driver}
                isActive={models.activeMarker === driver.id}
                handleClickMarker={commands.onClickMarker}
                handleOnCloseClick={commands.onCloseClick}
              />
            )
          })}
        </GoogleMap>
      </div>
    </div>
  )
}
