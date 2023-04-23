import { ApiContext } from 'types'
import { fetcher } from 'utils'

/**
 * CSRFトークン取得APIコール(Laravel Sanctum)
 * @param context APIコンテキスト
 */
const getCsrfToken = async (context: ApiContext) => {
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/csrf-cookie`,
    {
      method: 'GET',
      credentials: 'include',
    },
  )
}

export default getCsrfToken
