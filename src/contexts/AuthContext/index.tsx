import React, { useContext } from 'react'
import { getCsrf } from 'services/auth/get-csrf'
import { loginWithNameAndPassword } from 'services/auth/login'
import { logout } from 'services/auth/logout'
import useSWR from 'swr'
import type { ApiContext, User } from 'types'

type AuthContextType = {
  authUser?: User
  isLoading: boolean
  login: (name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  mutate: (
    data?: User | Promise<User>,
    shouldRevalidate?: boolean,
  ) => Promise<User | undefined>
}

type AuthContextProviderProps = {
  context: ApiContext
  authUser?: User
}

const AuthContext = React.createContext<AuthContextType>({
  authUser: undefined,
  isLoading: false,
  login: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  mutate: async () => Promise.resolve(undefined),
})

export const useAuthContext = (): AuthContextType =>
  useContext<AuthContextType>(AuthContext)

/**
 * 認証コンテキストプロバイダー
 * @param params パラメータ
 */
export const AuthContextProvider = ({
  authUser,
  children,
}: React.PropsWithChildren<AuthContextProviderProps>) => {
  const { data, error, mutate } = useSWR<User>('/api/me')
  console.log('Data:', data)
  console.log('Error:', error)
  const isLoading = !data && !error

  // ログイン
  const loginInternal = async (name: string, password: string) => {
    await getCsrf()
    await loginWithNameAndPassword({ name, password })
    await mutate()
  }

  // ログアウト
  const logoutInternal = async () => {
    // サーバサイドのセッションを破棄
    await logout()
    await mutate()
  }

  return (
    <AuthContext.Provider
      value={{
        authUser: data ?? authUser,
        isLoading,
        login: loginInternal,
        logout: logoutInternal,
        mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
