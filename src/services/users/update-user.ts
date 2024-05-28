import type { User } from 'types'
import { axios } from 'utils/axios'

/**
 * ユーザーAPI（更新）
 * @param user 更新するユーザー
 * @returns 更新したユーザー
 */
const updateUser = async (user: Partial<User>): Promise<User> => {
  return axios.patch(`/api/users/update`, user).then((res) => res.data)
}

export default updateUser
