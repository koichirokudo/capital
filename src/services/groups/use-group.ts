import useSWR from 'swr'
import type { User } from 'types'

const useGroup = () => {
  const { data, error, mutate } = useSWR<User[]>(`/api/user/group`)
  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useGroup
