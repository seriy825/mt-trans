import {BaseHttpServices} from 'shared/services/base-http-services'
import {IDriver} from 'shared/types/api-types/driver'

interface IFilterPayload {
  drivers: IDriver[]
  findedPlace: google.maps.places.PlaceResult
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
    if (!findedPlace) return drivers

    const directionsService = new window.google.maps.DirectionsService()
    const driversWithDistance = await Promise.all<IDriver>(
      drivers.map((driver) => {
        return new Promise(async (resolve) => {
          const driverLocation = {
            lat: driver.position[0],
            lng: driver.position[1],
          }
          const findedPlaceLocation = {
            lat: findedPlace.geometry.location.lat(),
            lng: findedPlace.geometry.location.lng(),
          }

          const request = {
            origin: driverLocation,
            destination: findedPlaceLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          }

          directionsService.route(request, (response, status) => {
            if (status === 'OK') {
              const distance =
                response.routes[0].legs[0].distance.value / 1609.34
              const hours = response.routes[0].legs[0].duration.value / 3600
              console.log(hours)
              if (distance <= milesFilter && driver.active) {
                const driverWithDistance = {
                  ...driver,
                  distance: distance,
                  hours:hours
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
    const validDrivers = driversWithDistance.filter((driver) => driver !== null)
    const sortedDrivers = validDrivers.sort((a, b) => a.distance - b.distance)
    return sortedDrivers
  }
}

export const DriverApi = new DriverApiService(new BaseHttpServices())
