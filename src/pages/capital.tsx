import { Grid } from '@mui/material'
import CapitalList from 'components/CapitalList'
import Template from 'components/Templates'
import CapitalFormContainer from 'container/CapitalFormContainer'
import { useAuthContext } from 'contexts/AuthContext'
import type { GetStaticProps, NextPage } from 'next'
import * as React from 'react'
import useAllCapital from 'services/capitals/use-all-capitals'
import { useAuthGaurd } from 'utils/hook'
import { FinancialTransactionsContextProvider } from '../contexts/FinancialTransactionsContext'
import { ApiContext } from '../types'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

const CapitalPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  const { authUser } = useAuthContext()
  const data = useAllCapital()
  const capitals = data.capitals ?? []

  if (!authUser || data.isLoading) {
    return <div>loading...</div>
  }

  return (
    <FinancialTransactionsContextProvider context={context}>
      <Template title="収支登録・編集">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={4}>
            <CapitalFormContainer mutate={data.mutate} />
          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <CapitalList capitals={capitals} mutate={data.mutate} />
          </Grid>
        </Grid>
      </Template>
    </FinancialTransactionsContextProvider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 10,
  }
}

export default CapitalPage
