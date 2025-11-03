import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'

const BASE_URL = 'https://api.coingecko.com/api/v3'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.error || error.message || 'Unknown error occurred',
      status: error.response?.status,
      code: error.code,
    }
    return Promise.reject(apiError)
  }
)

export function get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get<T>(endpoint, config).then((response) => response.data)
}

