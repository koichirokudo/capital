import UserEditForm, { UserEditFormData } from 'components/UserEditForm'
import { useAuthContext } from 'contexts/AuthContext'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import updateUser from 'services/users/update-user'
import { ApiContext, User } from 'types'
import { AxiosError } from 'axios'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

interface UserEditFormContainerProps {
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
const UserEditFormContainer = ({ onSave }: UserEditFormContainerProps) => {
  const { authUser } = useAuthContext()
  const setSpinner = useSpinnerActionsContext()
  const handleSave = async (data: UserEditFormData) => {
    if (!authUser) return

    const user = {
      id: data.id,
      userGroupId: data.userGroupId,
      authType: data.authType,
      profileImage: data.profileImage,
      name: data.name,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email,
      delete: data.delete,
    }

    try {
      setSpinner(true)
      const ret = await updateUser(context, user)
      onSave && onSave(undefined, ret)
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
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
