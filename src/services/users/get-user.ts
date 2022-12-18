import type { ApiContext, User } from 'types'
import { fetcher } from 'utils'

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
     "userId": "1"
     "groupId": "1"
     "authType": "1"
     "username": "Kouichiro Kudo"
     "password": "$78jlihfad["
     "email": "koichiro@example.com"
     "cancel": "false"
   }
   */
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/user/${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

export default getUser
