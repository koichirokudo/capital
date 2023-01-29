import UserEditForm, { UserFormData } from 'components/UserEditForm'
import { useAuthContext } from 'contexts/AuthContext'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import updateUser from 'services/users/update-user'
import { ApiContext, User } from 'types'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

interface UserFormContainerProps {
  /**
   * 保存した時に呼ばれるイベントハンドラ
   * @param error
   * @returns
   */
  onSave: (error?: Error, user?: User) => void
}

/**
 * ユーザー編集フォームコンテナ
 */
const UserEditFormContainer = ({ onSave }: UserFormContainerProps) => {
  const { authUser } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()
  const handleSave = async (data: UserFormData) => {
    if (!authUser) return

    const user = {
      id: data.id,
      groupId: data.groupId,
      authType: data.authType,
      profileImage: data.profileImage,
      username: data.username,
      password: data.password,
      email: data.email,
      cancel: data.cancel,
    }

    try {
      setSpinner(true)
      const ret = await updateUser(context, user)
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

  if (!authUser) {
    return <div>Loading...</div>
  }

  return authUser && <UserEditForm user={authUser} onUserSave={handleSave} />
}

export default UserEditFormContainer
