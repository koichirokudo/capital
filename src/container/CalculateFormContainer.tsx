import { useAuthContext } from '../contexts/AuthContext'
import { useSpinnerActionsContext } from '../contexts/SpinnerContext'
import { AxiosError } from 'axios'

interface CalculateFormContainerProps {
  /**
   * 精算した時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  onCalculate: (error?: Error) => void
}

/**
 * 精算フォームコンテナ
 */
const CalculateFormContainer = ({ mutate }: CalculateFormContainerProps) => {
  const { login } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()

  const handleCalculate = async (name: string, password: string) => {
    try   {
      setSpinner(true)
      await calculate(year, month, finalPayments)
      onCalculate && onCalculate()
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        window.alert(err.response?.data?.message ?? err.message)
        onCalculate && onCalculate(err)
      }
    } finally {
      setSpinner(false)
    }
  }

  return <CalculateForm handleCalculate={handleCalculate} />
}