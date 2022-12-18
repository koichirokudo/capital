import { ApiContext, Capital } from 'types'
import { fetcher } from 'utils'

export type GetCapitalParams = {
  /**
   * グループID
   */
  groupId: number
}

/**
 * 収支API（個別取得）
 * @param context APIコンテキスト
 * @param params パラメータ
 * @returns 収支
 */
const getCapital = async (
  context: ApiContext,
  { groupId }: GetCapitalParams,
): Promise<Capital[]> => {
  /**
   * サンプルレスポンス
   {
     "capitalId": "1"
     "userId": "1"
     "groupId": "1"
     "date": "2022-12-01 12:00:00"
     "categoryId": "1"
     "categoryType": "0"
     "note": "メモです"
     "money": "1000"
     "settlement": "false"
   }
   */
  return await fetcher(
    `${context.apiRootUrl.replace(/\/$/g, '')}/capital/${groupId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
}

export default getCapital
