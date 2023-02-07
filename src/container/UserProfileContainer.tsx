import UserProfile from 'components/UserProfile'
import useUser from 'services/users/use-user'
import { ApiContext, User } from 'types'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

interface UserProfileContainerProps {
  /**
   * ユーザーID
   */
  userId: number
  /**
   * 初期表示のユーザー
   */
  user?: User
}

/**
 * ユーザーページコンテナ
 */
const UserProfileContainer = ({ userId, user }: UserProfileContainerProps) => {
  const { user: u } = useUser(context, { id: userId, initial: user })

  if (!u) return <div>Loading...</div>

  return (
    <UserProfile
      username={u.username}
      email={u.email}
      profileImage={u.profileImage}
    />
  )
}

export default UserProfileContainer
