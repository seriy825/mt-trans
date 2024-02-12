import React from 'react'
import styles from './map.module.scss'
import {IDriver} from 'shared/types/api-types/driver'
import {Marker} from './Marker/Marker'
import {useMapPage} from '../useMapPage'
import {SearchBox} from './SearchBox/SearchBox'
import {Loader} from 'shared/components/loader/loader'
import MapBox, {Layer, Source} from 'react-map-gl'
import {MAPBOX_TOKEN} from 'shared/constants/token'
import mapboxgl from 'mapbox-gl'
import {CENTER_LAT, CENTER_LNG} from 'shared/constants/center'

const defaultZoom = 3.8
export const Map = () => {
  const {models, commands} = useMapPage()
  return (
    <div className={styles.wrapper}>
      <div className={styles['google-map']}>
        {models.isLoading && <Loader mode='blur' />}
        <SearchBox
          findedPlace={models.findedPlace}
          drivers={models.drivers}
          searchValue={models.searchValue}
          miles={models.milesFilter}
          onSearchChange={commands.onSearchChange}
          onSearchClear={commands.onSearchClear}
          onMilesChange={commands.onMilesChange}
          onSearch={commands.onSearch}
        />
        <MapBox
          maxBounds={models.bounds}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapLib={mapboxgl}
          initialViewState={{
            longitude: CENTER_LAT,
            latitude: CENTER_LNG,
            zoom: defaultZoom,
          }}
          style={{width: '100%', height: '90vh'}}
          mapStyle='mapbox://styles/yurik007/clsj5odf800ai01qu5acjgjze'
          attributionControl={false}
          reuseMaps
          dragRotate={false}
          onClick={commands.onClickMap}
        >
          {models.circle.circleCenter && (
            <>
              <Source type='geojson' data={models.circleGeoJson}>
                <Layer {...models.circleLayer} />
              </Source>
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
        </MapBox>
      </div>
    </div>
  )
}
