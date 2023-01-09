import { GridRowId } from '@mui/x-data-grid'
import type { ApiContext, Capital } from 'types'
import { fetcher } from 'utils'

/**
 * 収支API（削除）
 * @param context APIコンテキスト
 * @param id 削除する収支ID
 * @returns
 */
const deleteCapital = async (
  context: ApiContext,
  id: GridRowId,
): Promise<Capital> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/capitals/${id}`,
    {
      method: 'DELETE',
      headers: {
        Origin: '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
    },
  )
}

export default deleteCapital
