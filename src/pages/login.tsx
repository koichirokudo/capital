import type { NextPage } from 'next'
import Template from 'components/templates'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import LoginFormContainer from 'container/LoginFormContainer'

const LoginPage: NextPage = () => {
  const router = useRouter()

  // 認証後のイベントハンドラ
  const onLogin = async (err?: Error) => {
    if (!err) {
      // ログイン成功時にクエリ指定があれば、指定されたURLに遷移
      const redirectTo = (router.query['redirect_to'] as string) ?? '/dashboard'
      await router.push(redirectTo)
    }
  }

  return (
    <>
      <Template>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <LoginFormContainer onLogin={onLogin} />
        </Box>
      </Template>
    </>
  )
}

export default LoginPage
