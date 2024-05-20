import { axios } from 'utils/axios'
import { Decision } from 'types'


/**
 * 精算API
 * @param year
 * @param month
 * @param finalPayments
 */
const decision = async ({ year, month, payerId, payeeId, amount}: Decision) => {
  return await axios.post('/api/decision', { year, month, payeeId, payerId, amount })
}

export default decision