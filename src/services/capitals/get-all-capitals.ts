import type { ApiContext, Capital } from 'types'
import { fetcher } from 'utils'

export type GetAllCapitalsParams = {
  /**
   * 登録したユーザーID
   */
  userId?: number
  /**
   * 所属するグループID
   */
  groupId?: number
  /**
   * 昇順、降順
   */
  order?: 'asc' | 'desc'
}

/**
 * 収支API（一覧取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 */
const getAllCapitals = async (
  context: ApiContext,
  { userId, groupId, order }: GetAllCapitalsParams = {},
): Promise<Capital[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/capitals`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)
  groupId && params.append('groupId', `${groupId}`)
  order && params.append('_order', order)

  const query = params.toString()

  return await fetcher(query.length > 0 ? `${path}?${query}` : path, {
    method: 'GET',
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  })
}

export default getAllCapitals
