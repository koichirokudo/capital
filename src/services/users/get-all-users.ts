import type { ApiContext, User } from 'types'
import { fetcher } from 'utils/axios'

export type GetAllUsersParams = {
  /**
   * 所属するグループID
   */
  userGroupId?: number
  /**
   * 昇順、降順
   */
  order?: 'asc' | 'desc'
}

/**
 * ユーザAPI（一覧取得）
 * @param context APIコンテキスト
 * @param userGroupId
 * @param order
 * @returns ユーザ一覧
 */
const getAllUsers = async (
  context: ApiContext,
  { userGroupId, order }: GetAllUsersParams = {},
): Promise<User[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/users`
  const params = new URLSearchParams()

  userGroupId && params.append('userGroupId', `${userGroupId}`)
  order && params.append('_order', order)

  const query = params.toString()

  return await fetcher(query.length > 0 ? `${path}?${query}` : path, {
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  })
}

export default getAllUsers
