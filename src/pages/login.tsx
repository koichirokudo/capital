import { Box } from '@mui/material'
import Template from 'components/Templates'
import LoginFormContainer from 'container/LoginFormContainer'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const LoginPage: NextPage = () => {
  const router = useRouter()

  // 認証後のイベントハンドラ
  const onLogin = async (err?: Error) => {
    if (!err) {
      // ログイン成功時にクエリ指定があれば、指定されたURLに遷移
      const redirectTo = (router.query['redirect_to'] as string) ?? '/'
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
