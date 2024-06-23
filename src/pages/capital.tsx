import { Grid, Typography } from '@mui/material'
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
import useSettlement from '../services/settlement/use-settlement'
import MonthControl from '../components/MonthControl'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

const CapitalPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  const { authUser } = useAuthContext()
  const date: Date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(date.getMonth() + 1)
  const data = useAllCapital(selectedYear, selectedMonth)
  const capitals = data.capitals ?? []
  const { settlement } = useSettlement(selectedYear, selectedMonth)
  const [settled, setSettled] = React.useState(settlement.length > 0)

  React.useEffect(() => {
    setSettled(settlement.length > 0)
  }, [settlement])

  if (!authUser || data.isLoading) {
    return (
      <Template title="収支登録・編集">
        <p>loading...</p>
      </Template>
    )
  }

  return (
    <FinancialTransactionsContextProvider context={context}>
      <Template title="収支登録・編集">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <MonthControl
              year={selectedYear}
              month={selectedMonth}
              setYear={setSelectedYear}
              setMonth={setSelectedMonth}
            />
            <Typography variant="h4">
              {selectedYear}年{selectedMonth}月
            </Typography>
            <Typography variant="body1">
              {settled ? '精算済みです' : ''}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <CapitalFormContainer
              mutate={data.mutate}
              settled={settled}
              year={selectedYear}
              month={selectedMonth}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <CapitalList
              capitals={capitals}
              settled={settled}
              mutate={data.mutate}
            />
          </Grid>
        </Grid>
      </Template>
    </FinancialTransactionsContextProvider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

export default CapitalPage
