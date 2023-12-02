import Axios from 'axios'

import {API_BASE_URL} from 'shared/config/variables'
import {LocalStorageService} from 'shared/services/local-storage-service'

const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
})

axiosInstance.interceptors.request.use(
  function (config) {
    const token = LocalStorageService.get('token')
    if (token) {
      // @ts-ignore
      ;(config.headers || {})['Authorization'] = token
        ? 'Bearer ' + LocalStorageService.get('token')
        : undefined
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const axios = axiosInstance
