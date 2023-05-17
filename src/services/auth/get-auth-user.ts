import { axios } from 'utils/axios'
import { User } from 'types'

export const getAuthUser = (): Promise<User> => {
  return axios.get('/api/me')
}
