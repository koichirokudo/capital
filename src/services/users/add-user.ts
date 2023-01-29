import type { ApiContext, User } from 'types'
import { fetcher } from 'utils'

export type AddUserParams = {
  /**
   * 追加するユーザー
   * idを除く
   */
  user: Omit<User, 'id'>
}

/**
 * ユーザーAPI（新規追加）
 * @param APIコンテキスト
 * @param params 新規追加するユーザー
 * @returns 新規追加したユーザー
 */
const addUser = async (
  context: ApiContext,
  { user }: AddUserParams,
): Promise<User> => {
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/users`, {
    method: 'POST',
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify(user),
  })
}

export default addUser
