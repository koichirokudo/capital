import type { Capital } from 'types'
import { axios } from 'utils/axios'

/**
 * 収支API（更新）
 * @param capital 更新する収支
 * @returns 更新した収支
 */
const updateCapital = async (capital: Partial<Capital>): Promise<Capital> => {
  return axios
    .patch(`/api/capitals/${capital.id}`, capital)
    .then((res) => res.data)
}

export default updateCapital
