import useSWR from 'swr'
import type { Capital } from 'types'

export type UseCapitalProps = {
  /**
   * 所属するグループID
   */
  userGroupId?: number
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
const useAllCapital = ({ userGroupId }: UseCapitalProps): UseCapital => {
  const shouldFetch = Boolean(userGroupId)
  const { data, error, mutate } = useSWR<Capital[]>(
    shouldFetch ? `/api/capitals?userGroupId=${userGroupId}` : null,
  )

  return {
    capitals: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useAllCapital
