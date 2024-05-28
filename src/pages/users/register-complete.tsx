import { NextPage } from 'next'
import Template from 'components/Templates'
import { Box } from '@mui/material'

const RegisterCompletePage: NextPage = () => {
  return (
    <Template title="ユーザー登録完了">
      <Box sx={{ p: 2, minWidth: 450, minHeight: 350, textAlign: 'center' }}>
        <h2>ユーザー登録完了</h2>
        <p>ユーザー登録が完了しました。</p>
        <p>仮登録メールを送信したため、メールをご確認ください。</p>
      </Box>
    </Template>
  )
}

export default RegisterCompletePage
