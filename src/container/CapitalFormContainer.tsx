import CapitalForm from 'components/CapitalForm'
import { useAuthContext } from 'contexts/AuthContext'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import addCapital from 'services/capitals/add-capital'
import { Capital } from 'types'
import { AxiosError } from 'axios'

interface CapitalFormContainerProps {
  /**
   * 保存した時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  mutate: () => Promise<Capital[] | undefined>
  settled: boolean
  year: number
  month: number
}

/**
 * 収入登録フォームコンテナ
 * @param mutate
 * @param settled
 * @param year
 * @param month
 * @constructor
 */
const CapitalFormContainer = ({ mutate, settled, year, month }: CapitalFormContainerProps) => {
  const { authUser } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()
  const handleSave = async (data: Capital) => {
    if (!authUser) return

    const capital = {
      userId: authUser.id,
      userGroupId: authUser.userGroupId,
      settlementId: null,
      date: data.date,
      share: Boolean(data.share),
      financialTransactionId: Number(data.financialTransactionId),
      capitalType: Number(data.capitalType),
      money: Number(data.money),
      note: data.note ?? '',
    }

    try {
      setSpinner(true)
      await addCapital({ capital })
      await mutate()
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        window.alert(err.message)
      }
    } finally {
      setSpinner(false)
    }
  }
  return <CapitalForm onCapitalSave={handleSave} settled={settled} year={year} month={month} />
}

export default CapitalFormContainer
