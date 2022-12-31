import type { ApiContext, Group } from 'types'
import { fetcher } from 'utils'

/**
 * グループAPI（一覧取得）
 * @param context APIコンテキスト
 * @returns グループ一覧
 */
const getAllGroups = async (context: ApiContext): Promise<Group[]> => {
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/groups`, {
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

export default getAllGroups
