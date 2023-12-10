import React from 'react'
import {IDriver} from 'shared/types/api-types/driver'
import {InfoWindow} from '../InfoWindow/InfoWindow'
import {CAR_TYPE} from 'shared/types/car'
import {Marker as ExternalMarker} from 'react-map-gl'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'

interface IMarkerComponent {
  marker?: IDriver
  isActive?: boolean
  position?: number[]
  isCircleMarker?: boolean
  handleClickMarker?: (markerId: number) => void
  handleOnCloseClick?: () => void
}

const MARKER_STYLE = {
  [CAR_TYPE.SPRINTER]: <Icon icon={ICON_COLLECTION.blueMarker} />,
  [CAR_TYPE.BOX_TRUCK]: <Icon icon={ICON_COLLECTION.greenMarker} />,
  [CAR_TYPE.LARGE]: <Icon icon={ICON_COLLECTION.yellowMarker} />,
  circleMarker: <Icon icon={ICON_COLLECTION.circleMarker} />,
}

const MarkerComponent: React.FC<IMarkerComponent> = (
  props: IMarkerComponent
) => {
  const {
    marker,
    isActive,
    position,
    isCircleMarker,
    handleClickMarker,
    handleOnCloseClick,
  } = props
  const markerPosition = marker
    ? [marker.position[1], marker.position[0]]
    : position

  const onMarkerClick = (e) => {
    ;(e.originalEvent as Event).stopPropagation()
    handleClickMarker(marker.id)
  }

  const MarkerIcon = isCircleMarker ? (
    MARKER_STYLE.circleMarker
  ) : new Date(marker.dateAvailable) <= new Date() ? (
    MARKER_STYLE[`${marker.typeCar}`]
  ) : (
    <Icon icon={ICON_COLLECTION['redMarker']} />
  )

  return marker && marker?.active ? (
    <>
      <ExternalMarker
        longitude={marker.position[1]}
        latitude={marker.position[0]}
        style={{
          cursor: 'help',
        }}
        onClick={onMarkerClick}
      >
        {MarkerIcon}
      </ExternalMarker>
      {isActive && (
        <InfoWindow
          position={markerPosition}
          marker={marker}
          handleOnCloseClick={handleOnCloseClick}
        />
      )}
    </>
  ) : (
    isCircleMarker && (
      <ExternalMarker longitude={position[0]} latitude={position[1]}>
        {MarkerIcon}
      </ExternalMarker>
    )
  )
}

export const Marker = React.memo(MarkerComponent)
