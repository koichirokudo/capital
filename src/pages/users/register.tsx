import { Box } from '@mui/material'
import Template from 'components/Templates'
import UserRegisterFormContainer from 'container/UserRegisterFormContainer'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

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
