import useSWR from 'swr'
import type { ApiContext, Capital } from 'types'

export type UseCapitalProps = {
  /**
   * 所属するグループID
   */
  groupId?: number
  /**
   * 初期状態
   */
  initial?: Capital[]
}

export type UseCapital = {
  /**
   * 取得する収支
   */
  capitals?: Capital[]
  /**
   * ロードフラグ
   */
  isLoading: boolean
  /**
   * エラーフラグ
   */
  isError: boolean
  /**
   * mutate
   */
  mutate: (
    // eslint-disable-next-line no-unused-vars
    data?: Capital[] | Promise<Capital[]>,
    // eslint-disable-next-line no-unused-vars
    shouldRevalidate?: boolean,
  ) => Promise<Capital[] | undefined>
}

/**
 * 収支API（個別取得）のカスタムフック
 */
const useAllCapital = (
  context: ApiContext,
  { groupId, initial }: UseCapitalProps,
): UseCapital => {
  const { data, error, mutate } = useSWR<Capital[]>([
    `${context.apiRootUrl.replace(/\/$/g, '')}/capitals?groupId=${groupId}`,
  ])

  return {
    capitals: data ?? initial,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useAllCapital
