import { ApiContext, User } from 'types'
import { fetcher } from 'utils'

export type loginParams = {
  /**
   * ユーザ名
   */
  name: string
  /**
   * パスワード
   */
  password: string
}

/**
 * 認証API（ログイン）
 * @param context APIコンテキスト
 * @param csrfToken CSRFトークン
 * @param params パラメータ
 * @param ログインユーザ
 */
const login = async (
  context: ApiContext,
  csrfToken: string,
  params: loginParams,
): Promise<User> => {
  return await fetcher(`${context.apiRootUrl.replace(/\/$/g, '')}/login`, {
    method: 'POST',
    headers: {
      'X-XSRF-TOKEN': csrfToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify(params),
  })
}

export default login
