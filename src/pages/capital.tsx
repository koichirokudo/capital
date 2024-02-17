import { Grid } from '@mui/material'
import CapitalList from 'components/CapitalList'
import Template from 'components/Templates'
import CapitalFormContainer from 'container/CapitalFormContainer'
import { useAuthContext } from 'contexts/AuthContext'
import type { GetStaticProps, NextPage } from 'next'
import * as React from 'react'
import useAllCapital from 'services/capitals/use-all-capitals'
import { useAuthGaurd } from 'utils/hook'

const CapitalPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  const { authUser } = useAuthContext()
  const userGroupId = authUser?.userGroupId
  const data = useAllCapital({ userGroupId })
  const capitals = data.capitals ?? ''

  if (data.isLoading) {
    return <div>loading...</div>
  }

  return (
    <Template title="収支登録・編集">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={3}>
          <CapitalFormContainer mutate={data.mutate} />
        </Grid>
        <Grid item xs={12} md={12} lg={9}>
          <CapitalList capitals={capitals} mutate={data.mutate} />
        </Grid>
      </Grid>
    </Template>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 10,
  }
}

export default CapitalPage
