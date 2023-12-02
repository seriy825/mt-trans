import React from 'react'
import {Map} from './components/Map'
import {useJsApiLoader} from '@react-google-maps/api'
import {GMAP_TOKEN} from 'shared/constants/token'
import {Loader} from 'shared/components/loader/loader'
import {LIBRARIES} from 'shared/config/gmap'

export const MapPage: React.FC = () => {   
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: GMAP_TOKEN,
    libraries: LIBRARIES,
    language:'en'    
  })
  return isLoaded ? <Map /> : <Loader />
}
