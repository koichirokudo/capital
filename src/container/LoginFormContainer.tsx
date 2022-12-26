import LoginForm from 'components/form/LoginForm'
import { useAuthContext } from 'contexts/AuthContext'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'

interface LoginFormContainerProps {
  /**
   * ログインした時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  onLogin: (error?: Error) => void
}

/**
 * ログインフォームコンテナ
 */
const LoginFormContainer = ({ onLogin }: LoginFormContainerProps) => {
  const { login } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()

  const handleLogin = async (username: string, password: string) => {
    try {
      // ローディングスピナーを表示
      setSpinner(true)
      await login(username, password)
      onLogin && onLogin()
    } catch (err: unknown) {
      if (err instanceof Error) {
        // エラー内容を表示
        window.alert(err.message)
        onLogin && onLogin(err)
      }
    } finally {
      setSpinner(false)
    }
  }

  return <LoginForm handleLogin={handleLogin} />
}

export default LoginFormContainer
