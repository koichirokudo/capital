import type { ApiContext, User } from 'types'
import { fetcher } from 'utils/axios'

/**
 * ユーザーAPI（更新）
 * @param APIコンテキスト
 * @param params 更新するユーザー
 * @returns 更新したユーザー
 */
const updateUser = async (
  context: ApiContext,
  user: Partial<User>,
): Promise<User> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/users/${user.id}`,
    {
      method: 'PUT',
      headers: {
        Origin: '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(user),
    },
  )
}

export default updateUser
