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
  const { data, error, mutate } = useSWR<Capital[]>(
    `/api/capitals?userGroupId=${userGroupId}`,
  )

  return {
    capitals: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useAllCapital
