import { ApiContext, Capital } from 'types'
import { fetcher } from 'utils/axios'

export type GetCapitalParams = {
  /**
   * 収支ID
   */
  id?: number
  /**
   * ユーザーID
   */
  userId?: number
}

/**
 * 収支API（個別取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns 収支
 */
const getCapital = async (
  context: ApiContext,
  { id, userId }: GetCapitalParams,
): Promise<Capital[]> => {
  /**
   * サンプルレスポンス
   {
     "id": 1
     "userId": 1
     "userGroupId": 1
     "date": "2023-12-07 12:00:00"
     "capitalType": 0
     "financialTransaction_id": 1
     "money": 1000
     "share": "false"
     "settlement": "false"
     "settlement_at": "2023-12-01-11:00:01",
     "note": "memo"
     "create_at": "2023-12-01-11:00:01",
     "update_at": "2023-12-01-11:00:01"
   }
   */

  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/capitals/${id}`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)

  const query = params.toString()

  return await fetcher(query.length > 0 ? `${path}?${query}` : path, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
  })
}

export default getCapital
