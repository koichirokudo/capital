import useSWR from 'swr'
import type { Capital } from 'types'

/**
 * 収支API（個別取得）のカスタムフック
 */
const useAllCapital = (year: number, month: number) => {
  const { data, error, mutate } = useSWR<Capital[]>(
    `/api/capitals/${year}/${month}`,
  )

  return {
    capitals: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useAllCapital
