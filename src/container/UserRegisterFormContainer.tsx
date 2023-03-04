import UserRegisterForm, {
  UserRegisterFormData,
} from 'components/UserRegisterForm'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import addUser from 'services/users/add-user'
import { ApiContext, User } from 'types'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

interface UserRegisterFormContainerProps {
  /**
   * 保存した時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  // eslint-disable-next-line no-unused-vars
  onSave: (error?: Error, user?: User) => void
}

/**
 * ユーザー登録フォームコンテナ
 */
const UserRegisterFormContainer = ({
  onSave,
}: UserRegisterFormContainerProps) => {
  const setSpinner = useSpinnerActionsContext()
  const handleSave = async (data: UserRegisterFormData) => {
    //TODO: groupIdの登録は、招待機能構築時に追加する
    const user = {
      groupId: data.groupId,
      authType: data.authType,
      profileImage: data.profileImage,
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email,
      cancel: data.cancel,
    }

    try {
      setSpinner(true)
      const ret = await addUser(context, { user })
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

  return <UserRegisterForm onUserSave={handleSave} />
}

export default UserRegisterFormContainer
