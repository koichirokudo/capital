import { useAuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useAuthGaurd = (): void => {
  const router = useRouter()
  const { authUser, isLoading } = useAuthContext()

  useEffect(() => {
    // ユーザ情報が取得できない場合はログインページに遷移
    if (!authUser && !isLoading) {
      const currentPath = router.pathname

      router.push({
        pathname: '/login',
        query: {
          redirect_to: currentPath,
        },
      })
    }
  }, [router, authUser, isLoading])
}
