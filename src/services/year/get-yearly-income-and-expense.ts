import type { ApiContext, YearlyIncomeAndExpenses } from 'types'
import { fetcher } from 'utils/axios'

export type GetYealryIncomeAndExpensesParams = {
  /**
   * ユーザID
   */
  userId?: number
  /**
   * グループID
   */
  userGroupId?: number
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
const getYearlyIncomeAndExpenses = async (
  context: ApiContext,
  { userId, userGroupId, year, order }: GetYealryIncomeAndExpensesParams,
): Promise<YearlyIncomeAndExpenses[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/year`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)
  userGroupId && params.append('userGroupId', `${userGroupId}`)
  year && params.append('year', `${year}`)
  order && params.append('order', `${order}`)

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

export default getYearlyIncomeAndExpenses
