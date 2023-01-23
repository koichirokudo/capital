import { Grid } from '@mui/material'
import CapitalList from 'components/CapitalList'
import Template from 'components/Templates'
import CapitalFormContainer from 'container/CapitalFormContainer'
import { useAuthContext } from 'contexts/AuthContext'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import * as React from 'react'
import getAllCapitals from 'services/capitals/get-all-capitals'
import useAllCapital from 'services/capitals/use-all-capitals'
import { ApiContext } from 'types'
import { useAuthGaurd } from 'utils/hook'

const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

type CapitalPageProps = InferGetStaticPropsType<typeof getStaticProps>

const CapitalPage: NextPage = ({ capitals: initial }: CapitalPageProps) => {
  // 認証ガード
  useAuthGaurd()

  const router = useRouter()
  const { authUser } = useAuthContext()
  const groupId = authUser?.groupId
  const data = useAllCapital(context, { groupId, initial })
  const capitals = data.capitals ?? initial

  const onSave = (err?: Error) => {
    if (authUser && !err) {
      router.push(`/capital`)
    }
  }

  return (
    <Template title="収支登録・編集">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={3}>
          <CapitalFormContainer onSave={onSave} />
        </Grid>
        <Grid item xs={12} md={12} lg={9}>
          <CapitalList capitals={capitals} mutate={data.mutate} />
        </Grid>
      </Grid>
    </Template>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // 収支情報を取得して、静的ページを作成する
  // 10秒でstaleな状態にして、静的ページを更新する
  const capitals = await getAllCapitals(context)

  return {
    props: {
      capitals,
    },
    revalidate: 10,
  }
}

export default CapitalPage
