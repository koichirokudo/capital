import useSWR from 'swr'
import type { Settlement } from 'types'

/**
 * 精算情報を取得する
 */
const useSettlement = (year: number, month: number) => {
  const { data, error, mutate } = useSWR<Settlement[]>(
    `/api/settlement/${year}/${month}`,
  )
  console.log(data)
  return {
    settlement: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useSettlement