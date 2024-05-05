import useSWR from 'swr'
import type { Settlement } from 'types'

const useSettlements = () => {
  const { data, error, mutate } = useSWR<Settlement[]>(
    `/api/settlements`
  )
  return {
    settlements: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useSettlements
