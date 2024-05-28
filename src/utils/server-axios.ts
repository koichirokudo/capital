import Axios, { InternalAxiosRequestConfig } from 'axios'

export const axios = Axios.create({
  baseURL: 'http://api:8000',
})

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const fetcher = async (url: string) => {
  const response = await axios.get(url)
  return response.data
}
