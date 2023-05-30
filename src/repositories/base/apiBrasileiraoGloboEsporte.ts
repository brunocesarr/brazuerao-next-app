import axios, { AxiosRequestConfig } from 'axios'

const URL_BASE_API_BRASILEIRAO_GLOBOESPORTE =
  process.env.NEXT_PUBLIC_URL_BRAZUERAO_WEB_APP

const defaultOptions: AxiosRequestConfig = {
  baseURL: URL_BASE_API_BRASILEIRAO_GLOBOESPORTE,
  headers: {
    'Content-Type': 'application/json',
  },
}

const apiBrasileiraoGloboEsporte = axios.create(defaultOptions)

export default apiBrasileiraoGloboEsporte
