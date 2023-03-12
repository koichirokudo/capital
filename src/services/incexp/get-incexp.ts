import type { ApiContext, IncExp } from 'types'
import { fetcher } from 'utils'

export type GetIncExpParams = {
  /**
   * ユーザID
   */
  userId?: number
  /**
   * グループID
   */
  groupId?: number
  /**
   * 取得する年
   */
  year?: number
}

/**
 * ユーザAPI（個別取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns ユーザ
 */
const getIncExp = async (
  context: ApiContext,
  { userId, groupId, year }: GetIncExpParams,
): Promise<IncExp[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/incexp`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)
  groupId && params.append('groupId', `${groupId}`)
  year && params.append('year', `${year}`)

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

export default getIncExp
