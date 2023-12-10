import {MAPBOX_TOKEN} from 'shared/constants/token'
import {BaseHttpServices} from 'shared/services/base-http-services'
import {IDriver} from 'shared/types/api-types/driver'
import Matrix from '@mapbox/mapbox-sdk/services/matrix'
import {Point} from '@mapbox/mapbox-sdk/services/map-matching'
import {Coordinates} from '@mapbox/mapbox-sdk/lib/classes/mapi-request'

const directionsClient = Matrix({accessToken: MAPBOX_TOKEN})

interface MapboxFeatureContext {
  id: string
  mapbox_id: string
  wikidata: string
  text: string
  short_code?: string
}

interface MapboxFeatureGeometry {
  type: string
  coordinates: number[]
}

interface MapboxFeatureProperties {
  mapbox_id: string
}

export interface MapboxFeature {
  id: string
  type: string
  place_type: string[]
  relevance: number
  properties: MapboxFeatureProperties
  text: string
  place_name: string
  bbox: number[]
  center: number[]
  geometry: MapboxFeatureGeometry
  context: MapboxFeatureContext[]
}

interface MapboxResponse {
  type: string
  query: string[]
  features: MapboxFeature[]
  attribution: string
}

interface IFilterPayload {
  drivers: IDriver[]
  findedPlace: MapboxFeature
  milesFilter: number
}

export class DriverApiService {
  private readonly http: BaseHttpServices

  constructor(httpService: BaseHttpServices) {
    this.http = httpService
  }

  getDrivers = async (): Promise<IDriver[]> => {
    const payload = await this.http.get(`/drivers`)
    return payload.data
  }

  createDriver = async (driver: IDriver): Promise<IDriver> => {
    const payload = await this.http.post('/drivers', driver)
    return payload.data
  }

  updateDriver = async (driver: IDriver): Promise<IDriver> => {
    const payload = await this.http.put(`/drivers/${driver.id}`, driver)
    return payload.data
  }

  deleteDriver = async (driverId: number): Promise<void> => {
    const payload = await this.http.delete(`/drivers/${driverId}`)
    return payload.data
  }

  filterDriversByPosition = async ({
    drivers,
    findedPlace,
    milesFilter,
  }: IFilterPayload) => {
    if (!findedPlace || !milesFilter) return drivers

    const chunkedDrivers: IDriver[][] = []
    const batchSize = 24

    for (let i = 0; i < drivers.length; i += batchSize) {
      chunkedDrivers.push(drivers.slice(i, i + batchSize))
    }

    const updatedDrivers = drivers.map((driver) => ({...driver}))

    for (const driversChunk of chunkedDrivers) {
      const points: Point[] = [
        {coordinates: findedPlace.center as Coordinates},
        ...driversChunk.map((driver: IDriver) => ({
          coordinates: [driver.position[1], driver.position[0]] as Coordinates,
        })),
      ]

      const response = await directionsClient
        .getMatrix({
          profile: 'driving',
          points,
          sources: [0], // Индекс источника для результата (может быть массивом индексов)
          destinations: 'all', // Индекс пункта назначения для результата (может быть массивом индексов)
          annotations: ['distance', 'duration'], // Включаем только аннотации расстояния
        })
        .send()

      const responseDistances = response.body.distances[0]
      const responseDurations = response.body.durations[0]

      for (let i = 0; i < driversChunk.length; i++) {
        updatedDrivers[drivers.indexOf(driversChunk[i])].distance =
          responseDistances[i + 1] * 0.000621371 // Конвертировать в мили
        updatedDrivers[drivers.indexOf(driversChunk[i])].hours =
          responseDurations[i + 1] / 3600 // Конвертировать в мили
      }
    }

    const filteredDriver = updatedDrivers
      .filter((driver) => driver.distance <= milesFilter && driver.active)
      .sort((a, b) => a.distance - b.distance)
    return filteredDriver
  }

  findPlace = async (searchValue: string): Promise<MapboxResponse> => {
    const payload = await this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?country=US&types=postcode&access_token=${MAPBOX_TOKEN}`
    )
    return payload.data
  }
}

export const DriverApi = new DriverApiService(new BaseHttpServices())
