import type { Capital } from 'types'
import { axios } from 'utils/axios'

export type AddCapitalPramas = {
  /**
   * 追加する収支
   * capitalId を除く
   */
  capital: Omit<Capital, 'id'>
}

/**
 * 収支API（新規追加）
 * @param APIコンテキスト
 * @returns 新規追加した収支
 */
const addCapital = async ({ capital }: AddCapitalPramas): Promise<Capital> => {
  return await axios.post('/api/capitals', capital)
}

export default addCapital
