import useSWR from 'swr'
import type { FinancialTransactionRatios } from 'types'

/**
 * 月次の精算情報を取得する
 */
const useCalculateCapital = () => {
  const { data, error, mutate } = useSWR<FinancialTransactionRatios[]>(
    '/api/financial-transaction-ratio',
  )

  return {
    financialTransactionRatios: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useCalculateCapital
