import React from 'react'
import {Marker as ExternalMarker} from '@react-google-maps/api'
import {IDriver} from 'shared/types/api-types/driver'
import greenMarker from 'assets/icons/greenMarker.png'
import yellowMarker from 'assets/icons/yellowMarker.png'
import redMarker from 'assets/icons/redMarker.png'
import blueMarker from 'assets/icons/blueMarker.png'
import circleMarker from 'assets/icons/circleMarker.png'
import {InfoWindow} from '../InfoWindow/InfoWindow'
import {CAR_TYPE} from 'shared/types/car'

interface IMarkerComponent {
  marker?: IDriver
  isActive?: boolean
  position?: google.maps.LatLng | google.maps.LatLngLiteral | undefined
  handleClickMarker?: (
    markerId: number
  ) => (e: google.maps.MapMouseEvent) => void
  handleOnCloseClick?: () => void
}

const MARKER_STYLE = {
  [CAR_TYPE.SPRINTER]: blueMarker,
  [CAR_TYPE.BOX_TRUCK]: greenMarker,
  [CAR_TYPE.LARGE]: yellowMarker,
  circleMarker: circleMarker,
}

const MarkerComponent: React.FC<IMarkerComponent> = (
  props: IMarkerComponent
) => {
  const {marker, isActive, position, handleClickMarker, handleOnCloseClick} =
    props
  const markerPosition = marker
    ? {
        lat: marker.position[0],
        lng: marker.position[1],
      }
    : position
  return (
    marker.active && (
      <ExternalMarker
        position={markerPosition}
        onClick={marker ? handleClickMarker(marker.id) : null}
        cursor={marker ? 'help' : null}
        icon={{
          url: marker
            ? new Date(marker.dateAvailable) > new Date()
              ? MARKER_STYLE[marker.typeCar]
              : redMarker
            : MARKER_STYLE['circleMarker'],
          scaledSize: new google.maps.Size(15, 15),
        }}
      >
        {isActive && marker && (
          <InfoWindow
            position={markerPosition}
            marker={marker}
            handleOnCloseClick={handleOnCloseClick}
          />
        )}
      </ExternalMarker>
    )
  )
}

export const Marker = React.memo(MarkerComponent)
