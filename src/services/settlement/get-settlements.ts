import { fetcher } from 'utils/axios'
import { ApiContext, Settlement } from 'types'
export type GetSettlementsParams = {
  /**
   * ユーザーID
   */
  userId?: number
  /**
   * グループID
   */
  groupId?: number
  /**
   * 昇順、降順
   */
  order?: 'asc' | 'desc'
}

const getSettlements = async (
  context: ApiContext,
  { userId, groupId, order }: GetSettlementsParams,
): Promise<Settlement[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/settlement`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)
  groupId && params.append('groupId', `${groupId}`)
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

export default getSettlements
