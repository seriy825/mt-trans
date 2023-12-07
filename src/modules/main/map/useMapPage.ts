import {DriverApi} from 'app/api/driver-api/driver-api'
import {selectDrivers} from 'app/store/driver/selects'
import {ChangeEvent, useMemo, useState} from 'react'
import {useQuery} from 'react-query'
import {DRIVERS_FILTER} from 'shared/constants/query-keys'
import {THEMES, Theme} from 'shared/constants/theme'
import {US_BOUNDS} from 'shared/constants/usBounds'
import {LocalStorageService} from 'shared/services/local-storage-service'
import {IDriver} from 'shared/types/api-types/driver'
import {milesToMeters} from 'shared/utils/milesToMeters'

export const useMapPage = () => {
  const drivers: IDriver[] = selectDrivers()
  
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
  const queryParams = useMemo(() => {
    return {
      drivers,
      findedPlace,
      milesFilter,
    }
  }, [drivers, findedPlace, milesFilter])

  const {data, isLoading} = useQuery({
    queryKey: [DRIVERS_FILTER, queryParams],
    queryFn: async () => await DriverApi.filterDriversByPosition(queryParams),
    refetchOnWindowFocus: false,
  })

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
      setMilesFilter(200)
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
      drivers: data,
      findedPlace,
      bounds,
      circle: {
        circleCenter,
        circleRadius,
        circleOptions,
      },
      theme,
      activeTheme,
      isLoading,
      milesFilter,
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
      setActiveTheme
    },
  }
}
