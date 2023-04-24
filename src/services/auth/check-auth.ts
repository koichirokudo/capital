import { ApiContext, User } from 'types'
import { fetcher } from 'utils'

const checkAuth = async (context: ApiContext): Promise<User> => {
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  })
}

export default checkAuth
