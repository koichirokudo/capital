import type { ApiContext, Capital } from 'types'
import { fetcher } from 'utils'

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
 * @param params 新規追加する収支
 * @returns 新規追加した収支
 */
const addCapital = async (
  context: ApiContext,
  { capital }: AddCapitalPramas,
): Promise<Capital> => {
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/capitals`, {
    method: 'POST',
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify(capital),
  })
}

export default addCapital
