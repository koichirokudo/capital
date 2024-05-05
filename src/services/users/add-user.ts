import type { User } from 'types'
import { axios } from 'utils/axios'

export type AddUserParams = {
  /**
   * 追加するユーザー
   * idを除く
   */
  user: Omit<
    User,
    'id' | 'profileImage' | 'authType' | 'userGroupId' | 'delete'
  >
}

/**
 * ユーザーAPI（新規追加）
 * @param APIコンテキスト
 * @returns 新規追加したユーザー
 */
const addUser = async ({ user }: AddUserParams) => {
  return await axios.post('/api/users', user)
}

export default addUser
