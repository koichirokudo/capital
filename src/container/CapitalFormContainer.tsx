import CapitalForm, { CapitalFormData } from 'components/CapitalForm'
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
}

/**
 * 収入登録フォームコンテナ
 */
const CapitalFormContainer = ({ mutate }: CapitalFormContainerProps) => {
  const { authUser } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()
  const handleSave = async (data: CapitalFormData) => {
    if (!authUser) return

    const capital = {
      name: authUser.name,
      groupId: authUser.groupId,
      date: data.date,
      share: data.share ?? false,
      category: data.category,
      capitalType: data.capitalType,
      money: Number(data.money),
      note: data.note ?? '',
      settlement: false,
      settlementAt: '',
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
  return <CapitalForm onCapitalSave={handleSave} />
}

export default CapitalFormContainer
