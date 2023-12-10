import React from 'react'
import {IDriver} from 'shared/types/api-types/driver'
import {FIELDS_TO_SHOW_AT_INFO} from 'shared/constants/fielsToShowAtInfo'
import {Popup} from 'react-map-gl'
interface IInfoWindowComponent {
  marker: IDriver
  position: number[]
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
    <Popup
      longitude={position[0]}
      latitude={position[1]}
      offset={5}      
      onClose={handleOnCloseClick}
    >
      <div>
        {infoValues.map(([key, value]) => {
          const keyLabel =
            key === 'locationName'
              ? 'Location'
              : key[0].toUpperCase() + key.substring(1)
          return value ? (
            <p key={key} className='m-0 my-1'>
              <span className='fw-bold'>{`${keyLabel} `}</span>
              {value}
            </p>
          ) : null
        })}
      </div>
    </Popup>
  )
}

export const InfoWindow = React.memo(InfoWindowComponent)
