import type { ApiContext, User } from 'types'
import { fetcher } from 'utils/axios'

export type GetUserParams = {
  /**
   * ユーザID
   */
  id: number
}

/**
 * ユーザAPI（個別取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns ユーザ
 */
const getUser = async (
  context: ApiContext,
  { id }: GetUserParams,
): Promise<User> => {
  /**
   * サンプルレスポンス
   {
     "id": "1"
     "groupId": "1"
     "authType": "1"
     "profileImage": "https://example.com/profile.png"
     "name": "name"
     "password": "$78jlihfad["
     "email": "example@example.com"
     "delete": "false"
   }
   */
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/users/${id}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
}

export default getUser
