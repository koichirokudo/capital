import { GridRowId } from '@mui/x-data-grid'
import type { Capital } from 'types'
import { axios } from 'utils/axios'

/**
 * 収支API（削除）
 * @param context APIコンテキスト
 * @param id 削除する収支ID
 * @returns
 */
const deleteCapital = async (id: GridRowId): Promise<Capital> => {
  return await axios.delete(`/api/capitals/${id}`)
}

export default deleteCapital
