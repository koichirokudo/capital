import type { ApiContext, UserGroup } from 'types'
import { fetcher } from 'utils/axios'

export type GetUserGroupParams = {
  /**
   * グループID
   */
  id: number
}

/**
 * グループAPI（個別取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns グループ
 */
const getUserGroup = async (
  context: ApiContext,
  { id }: GetUserGroupParams,
): Promise<UserGroup> => {
  /**
   * サンプルレスポンス
   {
    "id": 1,
    "memberCount": 2,
    "inviteCode": "8flakdsfhaidfyasfkldjpad$&YJ",
    "startDay": 1,
    "create_at": "2022-12-01-11:00:01",
    "update_at": "2022-12-01-11:00:01""
   }
   */
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/user-groups/${id}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
}

export default getUserGroup
