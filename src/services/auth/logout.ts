import { axios } from 'utils/axios'
/**
 * 認証API（ログアウト）
 */
export const logout = (): Promise<{ message: string }> => {
  return axios.post('/api/logout')
}
