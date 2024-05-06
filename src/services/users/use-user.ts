import useSWR from 'swr'
import type { User } from 'types'

const useUser = () => {
  const { data, error, mutate } = useSWR<User[]>(`/api/user`)
  console.log(data)
  return {
    user: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export default useUser
