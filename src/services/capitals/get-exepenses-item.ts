import { ExpensesItem } from 'types'
import { axios } from 'utils/axios'


export type getExpensesItemsParams = {
  /**
   * 支出項目ID
   */
  id?: number
  /**
   * 支出タイプ
   * 0: 支出
   * 1: 収入
   */
  type?: number
}

const getExpensesItems = async (
  params: getExpensesItemsParams = {},
): Promise<ExpensesItem[]> => {
  return axios.get('/api/expenses-items', { params })
}

export default getExpensesItems
