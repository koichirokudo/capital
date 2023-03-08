import { Budgets } from '../../types/data'
import type { ApiContext } from 'types'
import { fetcher } from 'utils'

export type GetYearlyIncomeParams = {
  /**
   * 取得する年
   */
  year?: number
}

/**
 * 年間収入取得
 */
const getYearlyIncome = async (
  context: ApiContext,
  { year }: GetYearlyIncomeParams = {},
): Promise<Budgets> => {
  const path = `${context.apiRootUrl.replace(/\/$/g, '')}/income`
  const params = new URLSearchParams()
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

export default getYearlyIncome
