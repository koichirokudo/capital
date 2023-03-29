import type { ApiContext, YearlyIncomeAndExpense } from 'types'
import { fetcher } from 'utils'

export type GetYealryIncomeAndExpenseParams = {
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
  /**
   * 昇順、降順
   */
  order?: 'asc' | 'desc'
}

/**
 * 年間収入データ取得API
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns ユーザ
 */
const getYearlyIncomeAndExpense = async (
  context: ApiContext,
  { userId, groupId, year, order }: GetYealryIncomeAndExpenseParams,
): Promise<YearlyIncomeAndExpense[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/year`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)
  groupId && params.append('groupId', `${groupId}`)
  year && params.append('year', `${year}`)
  order && params.append('year', `${order}`)

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

export default getYearlyIncomeAndExpense