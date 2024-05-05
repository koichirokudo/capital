import UserRegisterForm from 'components/UserRegisterForm'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import { User } from 'types'
import { AxiosError } from 'axios'
import addUser from '../services/users/add-user'

interface UserRegisterFormContainerProps {
  /**
   * ユーザ登録した時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  onUserRegister: (error?: Error) => void
}

/**
 * ユーザー登録フォームコンテナ
 * @param onUserRegister
 * @constructor
 */
const UserRegisterFormContainer = ({
  onUserRegister,
}: UserRegisterFormContainerProps) => {
  const setSpinner = useSpinnerActionsContext()

  const handleUserRegister = async (data: User) => {
    const user = {
      email: data.email,
      password: data.password,
      name: data.name,
    }

    try {
      setSpinner(true)
      await addUser({ user })
      onUserRegister && onUserRegister()
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        window.alert(err.response?.data?.message ?? err.message)
        onUserRegister && onUserRegister(err)
      }
    } finally {
      setSpinner(false)
    }
  }

  return <UserRegisterForm handleUserRegister={handleUserRegister} />
}

export default UserRegisterFormContainer
