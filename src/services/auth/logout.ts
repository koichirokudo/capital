import type { ApiContext } from 'types'
import { fetcher } from 'utils'

/**
 * 認証API（ログアウト）
 * @param context APIコンテキスト
 * @returns ログアウトメッセージ
 */
const logout = async (context: ApiContext): Promise<{ message: string }> => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/auth/logout}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
}

export default logout
