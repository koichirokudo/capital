import LoginForm from 'components/LoginForm'
import { useAuthContext } from 'contexts/AuthContext'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import { AxiosError } from 'axios'

interface LoginFormContainerProps {
  /**
   * ログインした時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  // eslint-disable-next-line no-unused-vars
  onLogin: (error?: Error) => void
}

/**
 * ログインフォームコンテナ
 */
const LoginFormContainer = ({ onLogin }: LoginFormContainerProps) => {
  const { login } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()

  const handleLogin = async (name: string, password: string) => {
    try {
      // ローディングスピナーを表示
      setSpinner(true)
      await login(name, password)
      onLogin && onLogin()
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // エラー内容を表示
        window.alert(err.response?.data?.message ?? err.message)
        onLogin && onLogin(err)
      }
    } finally {
      setSpinner(false)
    }
  }

  return <LoginForm handleLogin={handleLogin} />
}

export default LoginFormContainer
