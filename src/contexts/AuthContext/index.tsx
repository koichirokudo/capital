import React, { useContext } from 'react'
import useSWR from 'swr'
import login from 'services/auth/login'
import logout from 'services/auth/logout'
import type { ApiContext, User } from 'types'

type AuthContextType = {
  authUser?: User
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
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
  context,
  authUser,
  children,
}: React.PropsWithChildren<AuthContextProviderProps>) => {
  const { data, error, mutate } = useSWR<User>(
    `${context.apiRootUrl.replace(/\/$/g, '')}/users/me`,
  )
  const isLoading = !data && !error

  // サインイン
  const loginInternal = async (username: string, password: string) => {
    await login(context, { username, password })
    await mutate()
  }

  // サインアウト
  const logoutInternal = async () => {
    await logout(context)
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
