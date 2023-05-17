import { axios } from 'utils/axios'

export const getCsrf = (): Promise<string> => {
  return axios.get('/sanctum/csrf-cookie')
}
