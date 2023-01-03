import CapitalForm, { CapitalFormData } from 'components/CapitalForm'
import { useAuthContext } from 'contexts/AuthContext'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import addCapital from 'services/capitals/add-capital'
import { ApiContext, Capital } from 'types'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

interface CapitalFormContainerProps {
  /**
   * 保存した時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  onSave: (error?: Error, capital?: Capital) => void
}

/**
 * 収入登録フォームコンテナ
 */
const CapitalFormContainer = ({ onSave }: CapitalFormContainerProps) => {
  const { authUser } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()
  const handleSave = async (data: CapitalFormData) => {
    if (!authUser) return

    const capital = {
      userId: authUser.id,
      groupId: authUser.groupId,
      date: data.date,
      category: data.category,
      categoryType: Number(data.categoryType),
      money: Number(data.money),
      note: data.note ?? '',
      settlement: false,
      settlementAt: '', // DBで日時登録する
      createAt: '', // 同上
      updateAt: '', // 同上
    }

    try {
      setSpinner(true)
      const ret = await addCapital(context, { capital })
      onSave && onSave(undefined, ret)
    } catch (err: unknown) {
      if (err instanceof Error) {
        window.alert(err.message)
        onSave && onSave(err)
      }
    } finally {
      setSpinner(false)
    }
  }
  return <CapitalForm onCapitalSave={handleSave} />
}

export default CapitalFormContainer
