import axios, { AxiosRequestConfig } from 'axios'

const URL_BASE_API_FUTEBOL: string = 'https://api.api-futebol.com.br'

const defaultOptions: AxiosRequestConfig = {
  baseURL: URL_BASE_API_FUTEBOL,
  headers: {
    'Content-Type': 'application/json',
  },
}

const apiFutebol = axios.create(defaultOptions)

apiFutebol.interceptors.request.use(
  function (config) {
    config.headers.setAuthorization(
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY_API_FUTEBOL}`
    )
    return config
  },
  function (error) {
    console.error(JSON.stringify(error))
    return Promise.reject(error)
  }
)

export default apiFutebol
