import { Box } from '@mui/material'
import Template from 'components/Templates'
import CapitalFormContainer from 'container/CapitalFormContainer'
import { useAuthContext } from 'contexts/AuthContext'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAuthGaurd } from 'utils/hook'

const CapitalPage: NextPage = () => {
  const router = useRouter()
  const { authUser } = useAuthContext()

  const onSave = (err?: Error) => {
    if (authUser && !err) {
      router.push(`/capital`)
    }
  }

  // 認証ガード
  useAuthGaurd()

  return (
    <Template title="収支登録・編集">
      <Box>
        <CapitalFormContainer onSave={onSave} />
      </Box>
    </Template>
  )
}

export default CapitalPage
