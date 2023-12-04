import {selectDrivers} from 'app/store/driver/selects'
import {ChangeEvent, useEffect, useMemo, useState} from 'react'
import {THEMES, Theme} from 'shared/constants/theme'
import {US_BOUNDS} from 'shared/constants/usBounds'
import {LocalStorageService} from 'shared/services/local-storage-service'
import {IDriver} from 'shared/types/api-types/driver'
import {milesToMeters} from 'shared/utils/milesToMeters'

export const useMapPage = () => {
  const drivers: IDriver[] = selectDrivers()

  const [filteredDrivers, setFilteredDrivers] = useState([])
  const [isDriversFiltering, setIsDriverFiltering] = useState<boolean>(false)
  const [activeTheme, setActiveTheme] = useState<Theme>(
    LocalStorageService.get('theme') || 'aubergine'
  )
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [searchBoxRef, setSearchBoxRef] =
    useState<google.maps.places.SearchBox>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [findedPlace, setFindedPlace] =
    useState<google.maps.places.PlaceResult>(null)
  const [milesFilter, setMilesFilter] = useState<number>(null)
  const [circleOptions, setCircleOptions] = useState(null)
  const [circleCenter, setCircleCenter] = useState(null)
  const [circleRadius, setCircleRadius] = useState(null)

  useEffect(() => {
    setIsDriverFiltering(true)
    if (findedPlace) {
      const findedPlaceLocation = {
        lat: findedPlace.geometry.location.lat(),
        lng: findedPlace.geometry.location.lng(),
      }
      const directionsService = new window.google.maps.DirectionsService()

      const fetchFilteredDrivers = async () => {
        const driversWithDistance = await Promise.all<IDriver>(
          drivers.map((driver) => {
            return new Promise(async (resolve) => {
              const driverLocation = {
                lat: driver.position[0],
                lng: driver.position[1],
              }

              const request = {
                origin: driverLocation,
                destination: findedPlaceLocation,
                travelMode: google.maps.TravelMode.DRIVING,
              }

              directionsService.route(request, (response, status) => {
                if (status === 'OK') {
                  const distance =
                    response.routes[0].legs[0].distance.value / 1609.34 // Расстояние в милях
                  if (distance <= milesFilter && driver.active) {
                    const driverWithDistance = {
                      ...driver,
                      distance: distance, // Округляем до двух знаков после запятой
                    }
                    resolve(driverWithDistance)
                  } else {
                    resolve(null)
                  }
                } else {
                  resolve(null)
                }
              })
            })
          })
        )
        const validDrivers = driversWithDistance.filter(
          (driver) => driver !== null
        )
        const sortedDrivers = validDrivers.sort(
          (a, b) => a.distance - b.distance
        )
        setFilteredDrivers(sortedDrivers)
      }

      fetchFilteredDrivers()
    } else {
      setFilteredDrivers(drivers)
    }
    setIsDriverFiltering(false)
  }, [findedPlace, milesFilter, drivers])

  const theme = useMemo(() => {
    LocalStorageService.set('theme', activeTheme)
    return THEMES[activeTheme]
  }, [activeTheme])

  const handleChangeTheme =
    (changeTheme: Theme | string) =>
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setActiveTheme(changeTheme as Theme)
    }

  const onMilesChange =
    (miles: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setCircleRadius(milesToMeters(miles))
      setMilesFilter(miles)
    }

  // const filteredDrivers = useMemo(() => {
  //   if (findedPlace)
  //     return drivers.filter((driver)=>{
  //       const findedPlaceLocation = {
  //         lat: findedPlace.geometry.location.lat(),
  //         lng: findedPlace.geometry.location.lng(),
  //       }
  //       const directionsService = new window.google.maps.DirectionsService()
  //       let distance = 0;
  //       const directionResult =  directionsService.route(
  //         {
  //           origin: findedPlaceLocation,
  //           destination: {lat: driver.position[0], lng: driver.position[1]},
  //           travelMode: google.maps.TravelMode.DRIVING,
  //         },
  //         (req,res)=>{
  //           // distance = res
  //         }
  //       )
  //       console.log(directionResult)
  //       // const distance = DistanceCalculator({lat: driver.position[0], lng: driver.position[1]}, findedPlaceLocation)
  //       return distance<=milesFilter && driver.active
  //     })
  //   return drivers
  // }, [milesFilter,findedPlace])

  const onSearchBarLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBoxRef(ref)
  }
  const bounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(US_BOUNDS.south, US_BOUNDS.west),
    new window.google.maps.LatLng(US_BOUNDS.north, US_BOUNDS.east)
  )

  const onPlacesChanged = () => {
    const places = searchBoxRef.getPlaces()
    if (places.length) {
      const findedPlace: google.maps.places.PlaceResult = places[0]
      setFindedPlace(findedPlace)
      setMilesFilter(400)
      setSearchValue(findedPlace.formatted_address)
      const placeCoords = {
        lat: findedPlace.geometry.location.lat(),
        lng: findedPlace.geometry.location.lng(),
      }
      setCircleRadius(milesToMeters(400))
      setCircleCenter(placeCoords)
      setCircleOptions({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'transparent',
        fillOpacity: 0.35,
      })
    }
  }

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const onSearchClear = () => {
    setSearchValue('')
    setCircleCenter(null)
    setFindedPlace(null)
    setMilesFilter(null)
  }

  const onClickMap = (e: google.maps.MapMouseEvent) => {
    setActiveMarker(null)
  }
  const onClickMarker = (marker: number) => (e: google.maps.MapMouseEvent) => {
    if (marker === activeMarker) {
      return
    }
    setActiveMarker(marker)
  }

  const onCloseClick = () => {
    setActiveMarker(null)
  }

  return {
    models: {
      activeMarker,
      searchValue,
      drivers: filteredDrivers,
      findedPlace,
      bounds,
      circle: {
        circleCenter,
        circleRadius,
        circleOptions,
      },
      theme,
      activeTheme,
      isDriversFiltering,
      milesFilter
    },
    commands: {
      onSearchBarLoad,
      onPlacesChanged,
      onSearchChange,
      onSearchClear,
      onClickMap,
      onClickMarker,
      onCloseClick,
      handleChangeTheme,
      onMilesChange,
    },
  }
}
