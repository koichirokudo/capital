import type { ApiContext, MonthlyIncomeAndExpenses } from 'types'
import { fetcher } from 'utils/axios'

export type GetMonthlyIncomeAndExpensesParams = {
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
   * 取得する月
   */
  month?: number
  /**
   * 昇順、降順
   */
  order?: 'asc' | 'desc'
}

/**
 * 月間支出データ取得API
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns ユーザ
 */
const getMonthlyIncomeAndExpenses = async (
  context: ApiContext,
  { userId, userGroupId, year, month, order }: GetMonthlyIncomeAndExpensesParams,
): Promise<MonthlyIncomeAndExpenses[]> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/month`
  const params = new URLSearchParams()

  userId && params.append('userId', `${userId}`)
  userGroupId && params.append('userGroupId', `${userGroupId}`)
  year && params.append('year', `${year}`)
  month && params.append('month', `${month}`)
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

export default getMonthlyIncomeAndExpenses
