import type { ApiContext, CapitalHistory } from 'types'
import { fetcher } from 'utils/axios'

export type GetAllCapitalHistoryParams = {
  /**
   * 状態
   */
  status?: number
  /**
   * 登録したユーザーID
   */
  userId?: number
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
 * 収支履歴API（一覧取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 */
const getAllCapitalHistory = async (
  context: ApiContext,
  { status, userId, userGroupId, order }: GetAllCapitalHistoryParams = {},
): Promise<CapitalHistory[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/capital-history/`
  const params = new URLSearchParams()

  status && params.append('status', `${status}`)
  userId && params.append('userId', `${userId}`)
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

export default getAllCapitalHistory
