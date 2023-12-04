import React from 'react'
import {IDriver, IPosition} from 'shared/types/api-types/driver'
import {InfoWindow as ExternalInfoWindow} from '@react-google-maps/api'
import {FIELDS_TO_SHOW_AT_INFO} from 'shared/constants/fielsToShowAtInfo'
interface IInfoWindowComponent {
  marker: IDriver
  position: IPosition | google.maps.LatLng | google.maps.LatLngLiteral | undefined
  handleOnCloseClick: () => void
}

const InfoWindowComponent: React.FC<IInfoWindowComponent> = (
  props: IInfoWindowComponent
) => {
  const {marker, position, handleOnCloseClick} = props
  const infoValues = Object.entries(marker).filter(([key, value]) =>
    FIELDS_TO_SHOW_AT_INFO.includes(key.toLowerCase())
  )
  return (
    <ExternalInfoWindow
      options={{pixelOffset: new google.maps.Size(0, -20)}}
      position={position}
      onCloseClick={handleOnCloseClick}
    >
      <div>
        {infoValues.map(([key, value]) => {
          const keyLabel = key==='locationName' ? 'Location' : key[0].toUpperCase() + key.substring(1)
          return value ? (
            <p key={key} className='m-0 my-1'>
              <span className='fw-bold'>{`${keyLabel} `}</span>
              {value}
            </p>
          ) : null
        })}
      </div>
    </ExternalInfoWindow>
  )
}

export const InfoWindow = React.memo(InfoWindowComponent)
