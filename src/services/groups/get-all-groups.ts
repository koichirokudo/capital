import type { ApiContext, UserGroup } from 'types'
import { fetcher } from 'utils/axios'

/**
 * グループAPI（一覧取得）
 * @param context APIコンテキスト
 * @returns グループ一覧
 */
const getAllUserGroups = async (context: ApiContext): Promise<UserGroup[]> => {
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/user-groups`, {
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

export default getAllUserGroups
