import {axios} from 'app/config/axios/axios'
import {AxiosRequestConfig, AxiosResponse} from 'axios'

import {ResponseError} from 'app/api/error-entity'

export class BaseHttpServices {
  getErrorMessage(message: string): string | undefined {
    return message
  }

  onResponse(response: any) {
    if (
      typeof response.data === 'object' &&
      'ok' in response.data &&
      !response.data.ok
    ) {
      const error = new ResponseError(
        response,
        this.getErrorMessage(response.data.message)
      )
      
      throw error
    }
  }

  async get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    const response = await axios.get(url, config)

    this.onResponse(response)

    return response as unknown as Promise<R>
  }

  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<any> | undefined
  ): Promise<R> {
    const response = await axios.post(url, data, config)

    this.onResponse(response)

    return response as unknown as Promise<R>
  }

  async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<any> | undefined
  ): Promise<R> {
    const response = await axios.put(url, data, config)

    this.onResponse(response)

    return response as unknown as Promise<R>
  }

  async delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<any> | undefined
  ): Promise<R> {
    const response = await axios.delete(url, config)

    this.onResponse(response)

    return response as unknown as Promise<R>
  }

  async patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<any> | undefined
  ): Promise<R> {
    const response = await axios.patch(url, data, config)

    this.onResponse(response)

    return response as unknown as Promise<R>
  }
}
