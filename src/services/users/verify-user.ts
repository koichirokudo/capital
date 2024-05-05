import { axios } from 'utils/axios'

export type VerifyUserParams = {
  token: string
}

export type VerifyUserResponse = {
  status?: string
  message?: string
}

/**
 * ユーザーAPI（認証）
 * @param context APIコンテキスト
 * @returns 認証結果
 */
const verifyUser = async ({
  token,
}: VerifyUserParams): Promise<VerifyUserResponse> => {
  return await axios.post(`/api/users/verify`, { token })
}

export default verifyUser
