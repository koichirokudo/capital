import type { ApiContext, Capital } from 'types'
import { fetcher } from 'utils'

/**
 * 収支API（更新）
 * @param context APIコンテキスト
 * @param csrfToken CSRFトークン
 * @param params 更新する収支
 * @returns 更新した収支
 */
const updateCapital = async (
  context: ApiContext,
  csrfToken: string,
  capital: Partial<Capital>,
): Promise<Capital> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/capitals/${capital.id}`,
    {
      method: 'PUT',
      headers: {
        Origin: '*',
        'X-XSRF-TOKEN': csrfToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(capital),
    },
  )
}

export default updateCapital
