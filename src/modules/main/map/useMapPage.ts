import {DriverApi, MapboxFeature} from 'app/api/driver-api/driver-api'
import {selectDrivers} from 'app/store/driver/selects'
import {CircleLayer, FillLayer, LineLayer, MapLayerMouseEvent} from 'mapbox-gl'
import {ChangeEvent, useMemo, useState} from 'react'
import {LngLatBoundsLike} from 'react-map-gl'
import {useQuery} from 'react-query'
import {DRIVERS_FILTER} from 'shared/constants/query-keys'
import {THEMES, Theme} from 'shared/constants/theme'
import {US_BOUNDS} from 'shared/constants/usBounds'
import {LocalStorageService} from 'shared/services/local-storage-service'
import {IDriver} from 'shared/types/api-types/driver'
import {milesToMeters} from 'shared/utils/milesToMeters'
import * as turf from '@turf/turf'
import {Units} from '@turf/turf'

export const useMapPage = () => {
  const drivers: IDriver[] = selectDrivers()

  const [activeTheme, setActiveTheme] = useState<Theme>(
    LocalStorageService.get('theme') || 'aubergine'
  )
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [findedPlace, setFindedPlace] = useState<MapboxFeature>(null)
  const [milesFilter, setMilesFilter] = useState<number>(null)
  const [circleCenter, setCircleCenter] = useState(null)
  const [circleRadius, setCircleRadius] = useState<number>(null)
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
    refetchOnMount: false,
  })

  const theme = useMemo(() => {
    LocalStorageService.set('theme', activeTheme)
    return THEMES[activeTheme]
  }, [activeTheme])

  const circleGeoJson = useMemo(() => {
    if (!circleCenter) return null
    const center = circleCenter

    // Создаем окружность с указанным радиусом
    const options = {steps: 64, units: 'miles' as Units}
    const circle = turf.circle(center, circleRadius, options)

    // Получаем координаты полигона окружности
    const geoJson: GeoJSON.Feature<GeoJSON.Geometry> = {
      type: 'Feature',
      geometry: circle.geometry,
      properties: {},
    }
    return geoJson
  }, [circleCenter, circleRadius])

  const handleChangeTheme =
    (changeTheme: Theme | string) =>
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setActiveTheme(changeTheme as Theme)
    }

  const onMilesChange =
    (miles: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setCircleRadius(miles)
      setMilesFilter(miles)
    }

  const bounds: LngLatBoundsLike = [
    US_BOUNDS.west,
    US_BOUNDS.south,
    US_BOUNDS.east,
    US_BOUNDS.north,
  ]

  const circleLayer: FillLayer = {
    id: 'point',
    type: 'fill',
    paint: {
      'fill-color': 'rgba(255, 0, 0, 1)',
      'fill-opacity': 0.1,
      'fill-outline-color':'white'
    },
  }

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const onSearch = async () => {
    if (searchValue.trim() !== '') {
      const data = await DriverApi.findPlace(searchValue)
      if (data && data.features && data.features.length > 0) {
        const name = data.features[0].place_name
        setSearchValue(name)
        setFindedPlace(data.features[0])
        setCircleCenter(data.features[0].center)
        setMilesFilter(200)
        setCircleRadius(200)
      } else {
        setSearchValue('Location not found')
      }
    } else {
      setSearchValue('')
    }
  }

  const onSearchClear = () => {
    setSearchValue('')
    setCircleCenter(null)
    setFindedPlace(null)
    setMilesFilter(null)
  }

  const onClickMap = (e: MapLayerMouseEvent) => {
    e.originalEvent.stopPropagation()
    setActiveMarker(null)
  }
  const onClickMarker = (marker: number) => {
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
      },
      theme,
      activeTheme,
      isLoading,
      milesFilter,
      circleLayer,
      circleGeoJson,
    },
    commands: {
      onSearch,
      onSearchChange,
      onSearchClear,
      onClickMap,
      onClickMarker,
      onCloseClick,
      handleChangeTheme,
      onMilesChange,
      setActiveTheme,
    },
  }
}
