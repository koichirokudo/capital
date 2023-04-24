import { ApiContext } from 'types'

/**
 * CSRFトークン取得APIコール(Laravel Sanctum)
 * @param context APIコンテキスト
 */
const getCsrfToken = async (context: ApiContext) => {
  return await fetch(`${context.apiRootUrl.replace(/\/$/g, '')}/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  })
}

export default getCsrfToken
