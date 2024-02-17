import type { Capital } from 'types'
import { axios } from 'utils/axios'

export type GetAllCapitalsParams = {
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
 * 収支API（一覧取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 */
const getAllCapitals = async (
  context: any,
  params: GetAllCapitalsParams = {},
): Promise<Capital[]> => {
  return axios.get('http://api:8000/api/capitals', {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      'X-Server-Side-Request': 'true',
    },
    params,
  })
}

export default getAllCapitals
