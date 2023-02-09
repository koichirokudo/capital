import type { NextPage } from 'next'
import Template from 'components/Templates'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import UserRegisterFormContainer from 'container/UserRegisterFormContainer'

/**
 * ユーザー登録ページ
 */
const RegisterPage: NextPage = () => {
  const router = useRouter()

  // 登録後のイベントハンドラ
  const onSave = async (err?: Error) => {
    if (!err) {
      // 登録後はトップページに遷移する
      await router.push('/')
    }
  }

  return (
    <>
      <Template>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <UserRegisterFormContainer onSave={onSave} />
        </Box>
      </Template>
    </>
  )
}

export default RegisterPage
