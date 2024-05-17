import useSWR from 'swr'
import type { Calculate } from 'types'

/**
 * 月次の精算情報を取得する
 */
const useCalculateCapital = (year: number, month: number) => {
  const { data, error, mutate } = useSWR<Calculate>(
    `/api/capitals/calculate/${year}/${month}`,
  )

  return {
    paymentByCategory: data?.paymentByCategory || {},
    paymentPlanTotal: data?.paymentPlanTotal || {},
    users: data?.users || {},
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useCalculateCapital
