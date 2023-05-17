import type { ApiContext, Group } from 'types'
import { fetcher } from 'utils/axios'

export type GetGroupParams = {
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
const getGroup = async (
  context: ApiContext,
  { id }: GetGroupParams,
): Promise<Group> => {
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
    `${context.apiRootUrl.replace(/\/$/g, '')}/groups/${id}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
}

export default getGroup
