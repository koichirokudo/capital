import { GridRowId } from '@mui/x-data-grid'
import type { ApiContext, Capital } from 'types'
import { fetcher } from 'utils'

/**
 * 収支API（更新）
 * @param APIコンテキスト
 * @param params 更新する収支
 * @returns 更新した収支
 */
const updateCapital = async (
  context: ApiContext,
  capital: Partial<Capital>,
): Promise<Capital> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/capitals/${capital.id}`,
    {
      method: 'PUT',
      headers: {
        Origin: '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(capital),
    },
  )
}

export default updateCapital
