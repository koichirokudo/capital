import React, { useContext } from 'react'
import getCsrfToken from 'services/auth/csrf'
import login from 'services/auth/login'
import logout from 'services/auth/logout'
import useSWR from 'swr'
import type { ApiContext, User } from 'types'
import { getCookie } from 'utils/cookie'

type AuthContextType = {
  authUser?: User
  isLoading: boolean
  // eslint-disable-next-line no-unused-vars
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  mutate: (
    // eslint-disable-next-line no-unused-vars
    data?: User | Promise<User>,
    // eslint-disable-next-line no-unused-vars
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
    `${context.apiRootUrl.replace(/\/$/g, '')}/me`,
  )
  const isLoading = !data && !error

  // ログイン
  const loginInternal = async (username: string, password: string) => {
    await getCsrfToken(context)
    const token = decodeURIComponent(getCookie('XSRF-TOKEN'))
    await login(context, token, { username, password })
    await mutate()
  }

  // ログアウト
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
