import { Grid, Paper, Typography } from '@mui/material'
import { BarChart } from 'components/BarChart'
import MonthControl from 'components/MonthControl'
import Template from 'components/Templates'
import { MONTH_LIST, YEAR_LIMIT } from 'const'
import type {
  GetStaticProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'
import { useAuthContext } from '../../contexts/AuthContext'
import React from 'react'
import useSWR from 'swr'
import { FinancialTransactions } from 'types'
import { INCOME, EXPENSES } from 'const'

const ReportMonthPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  const { authUser } = useAuthContext()

  // カテゴリ情報を取得する
  const { data: incomeItem } = useSWR<FinancialTransactions[]>(
    `/api/financial-transactions?type=${INCOME}`,
    (url) => fetch(url).then((res) => res.json()),
  )
  const { data: expensesItem } = useSWR<FinancialTransactions[]>(
    `/api/financial-transactions?type=${EXPENSES}`,
    (url) => fetch(url).then((res) => res.json()),
  )
  // 今月をデフォルトにする
  const date: Date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(
    date.getFullYear().toString(),
  )
  const [selectedMonth, setSelectedMonth] = React.useState(
    (date.getMonth() + 1).toString(),
  )

  const { data: incomeAndExpenses } = useSWR(
    authUser?.id
      ? `/api/month?user_id=${authUser?.id}&year=${selectedYear}&month=${selectedMonth}`
      : null,
    (url) => fetch(url).then((res) => res.json()),
  )

  const specificIncomeAndExpenses = incomeAndExpenses?.data.filter(
    (item: { year: string; month: string }) =>
      item.year === selectedYear &&
      item.month ===
        `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`,
  )

  // データが登録されていない
  if (!specificIncomeAndExpenses || specificIncomeAndExpenses.length === 0) {
    return (
      <Template title="月間レポート">
        <MonthControl
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />
        <Typography variant="body1">
          {selectedYear}年{selectedMonth}月のデータはありません。
        </Typography>
      </Template>
    )
  }

  console.log(incomeItem)
  console.log(expensesItem)

  const options = {
    indexAxis: 'y' as const,
    skipNull: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true,
        font: {
          size: 10,
          weight: 600,
        },
        formatter: function (value: { toString: () => string | number }) {
          if (Number(value) > 0) {
            return formatMoney(value.toString(), true)
          } else {
            return null
          }
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  }

  const { incomeDetails, expensesDetails } = specificIncomeAndExpenses[0]
  const categoryIncomeData = Object.values<number>(incomeDetails ?? [])
  const categoryExpensesData = Object.values<number>(expensesDetails ?? [])

  const incomeCategoriesData = {
    labels: incomeItem?.map((item) => item.label),
    datasets: [
      {
        label: 'カテゴリ',
        data: categoryIncomeData,
        backgroundColor: 'rgba(0, 171, 85, 0.9)',
        barPercentage: 0.9,
        borderRadius: 10,
        skipNull: true,
      },
    ],
  }

  const expensesCategoriesData = {
    labels: expensesItem?.map((item) => item.label),
    datasets: [
      {
        label: 'カテゴリ',
        data: categoryExpensesData,
        backgroundColor: 'rgba(255, 171, 0, 0.9)',
        barPercentage: 0.9,
        borderRadius: 10,
        skipNull: true,
      },
    ],
  }

  return (
    <Template title="月間レポート">
      <MonthControl
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
      />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <BarChart
              data={incomeCategoriesData}
              options={options}
              height={200}
              width={1200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <BarChart
              data={expensesCategoriesData}
              options={options}
              height={500}
              width={1200}
            />
          </Paper>
        </Grid>
      </Grid>
    </Template>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

export default ReportMonthPage
