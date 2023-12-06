import React from 'react'
import {Circle, GoogleMap} from '@react-google-maps/api'
import styles from './map.module.scss'
import {IDriver} from 'shared/types/api-types/driver'
import {Marker} from './Marker/Marker'
import {useMapPage} from '../useMapPage'
import {CENTER_POINT} from 'shared/constants/center'
import {ThemeDropdown} from './themeDropdown/themeDropdown'
import {SearchBox} from './SearchBox/SearchBox'
import {Loader} from 'shared/components/loader/loader'

const containerStyle = {
  width: '100%',
  height: '90vh',
}

const defaultZoom = 5

export const Map = () => {
  const {models, commands} = useMapPage()
  const handleZoomChanged = (map: google.maps.Map) => {
    map.addListener('zoom_changed', () => {
      const zoomLevel = map.getZoom()
      console.log(zoomLevel)
      // Проверяем уровень зума
      if (zoomLevel > 7) {
        // Примерный уровень зума, при котором вы хотите включить отображение дорог
        // Устанавливаем тему с включенными дорогами
        commands.handleChangeTheme(`${models.activeTheme}WithRoads}`) // Замените "themeWithRoads" на вашу тему с включенными дорогами
      } else {
        // Иначе оставляем тему без дорог
        commands.handleChangeTheme(`${models.activeTheme}`)
      }
    })
  }
  return (
    <div className={styles.wrapper}>
      <div className='d-flex justify-content-end'>
        <ThemeDropdown
          activeTheme={models.activeTheme}
          onChangeTheme={commands.handleChangeTheme}
        />
      </div>
      <div className={styles['google-map']}>
        {models.isLoading && <Loader mode='blur' />}
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
          zoom={defaultZoom}
          options={{
            mapTypeControl: false,
            disableDefaultUI: true,
            styles: models.theme,
          }}
          onClick={commands.onClickMap}
          onLoad={handleZoomChanged}
        >
          {models.circle.circleCenter && (
            <>
              <Circle
                onClick={commands.onClickMap}
                center={models.circle.circleCenter}
                radius={models.circle.circleRadius}
                options={models.circle.circleOptions}
              />
              <Marker position={models.circle.circleCenter} isCircleMarker />
            </>
          )}
          {models.drivers?.map((driver: IDriver) => {
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
