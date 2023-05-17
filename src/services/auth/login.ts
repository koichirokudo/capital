import { axios } from 'utils/axios'

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
 */
export const loginWithNameAndPassword = (
  params: loginParams,
): Promise<string> => {
  return axios.post('/api/login', params)
}
