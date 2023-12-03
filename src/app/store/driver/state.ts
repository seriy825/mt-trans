import {DriverApi} from 'app/api/driver-api/driver-api'
import {IDriver} from 'shared/types/api-types/driver'
import {create} from 'zustand'
import {devtools} from 'zustand/middleware'

interface IDriverState {
  drivers: IDriver[] | null
  isLoading: boolean
  getDrivers: () => void
  updateDriver: (driver: IDriver) => void
  deleteDriver: (id: number) => void
}

export const useDriverState = create<IDriverState>()(
  devtools(
    (set) => ({
      drivers: [],
      isLoading: false,
      getDrivers: async function () {
        try {
          set({isLoading: true})
          const drivers = await DriverApi.getDrivers()
          set({drivers: drivers})
          set({isLoading: false})
        } catch (e) {
          set({isLoading: false})
        }
      },
      updateDriver(updatedDriver: IDriver | null) {
        if (!updatedDriver) {
          return
        }
        set((state) => {
          const driverId = state.drivers.findIndex(
            (driver) => driver.id === updatedDriver.id
          )
          if (driverId===-1){
            state.drivers.push(updatedDriver)
            return state
          }
        state.drivers.splice(driverId, 1, updatedDriver)
        return {
            ...state,
            drivers: state.drivers,
        }
          
        })
      },
      deleteDriver(id: number) {
        set((state) => {
          const driverId = state.drivers.findIndex((driver) => driver.id === id)
          state.drivers.splice(driverId, 1)
          return {
            ...state,
            drivers: state.drivers,
          }
        })
      },
    }),
    {name: 'useDriverState', store: 'useDriverState'}
  )
)
