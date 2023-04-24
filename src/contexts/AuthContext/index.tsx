import React, { useContext } from 'react'
import getCsrfToken from 'services/auth/csrf'
import login from 'services/auth/login'
import logout from 'services/auth/logout'
import useSWR from 'swr'
import type { ApiContext, User } from 'types'
import { getCookie } from 'utils/cookie'

type AuthContextType = {
  authUser?: User
  csrfToken?: string
  isLoading: boolean
  login: (name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  mutate: (
    data?: User | Promise<User>,
    shouldRevalidate?: boolean,
  ) => Promise<User | undefined>
  setCsrfToken: (token: string) => void
}

type AuthContextProviderProps = {
  context: ApiContext
  authUser?: User
}

const AuthContext = React.createContext<AuthContextType>({
  authUser: undefined,
  csrfToken: undefined,
  isLoading: false,
  login: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  mutate: async () => Promise.resolve(undefined),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCsrfToken: () => {},
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
  const [csrfToken, setCsrfToken] = React.useState<string | undefined>(
    undefined,
  )
  const { data, error, mutate } = useSWR<User>(
    `${context.apiRootUrl.replace(/\/$/g, '')}/me`,
  )
  const isLoading = !data && !error

  // ログイン
  const loginInternal = async (name: string, password: string) => {
    await getCsrfToken(context)
    const token = decodeURIComponent(getCookie('XSRF-TOKEN'))
    await login(context, token, { name, password })
    setCsrfToken(token)
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
        csrfToken,
        isLoading,
        login: loginInternal,
        logout: logoutInternal,
        mutate,
        setCsrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
