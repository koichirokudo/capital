import { Grid, Paper, Typography } from '@mui/material'
import { BarChart } from 'components/BarChart'
import MonthControl from 'components/MonthControl'
import Template from 'components/Templates'
import type { GetStaticProps, NextPage } from 'next'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'
import React from 'react'
import useSWR from 'swr'

const ReportMonthPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  // 今月をデフォルトにする
  const date: Date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(date.getMonth() + 1)
  const { data: incomeAndExpenses } = useSWR('/api/month', (url) =>
    fetch(url).then((res) => res.json()),
  )
  console.log(incomeAndExpenses)

  const specificIncomeAndExpenses = incomeAndExpenses?.data.filter(
    (item: { year: string; month: string }) =>
      item.month ===
      `${selectedYear.toString()}-${selectedMonth.toString().padStart(2, '0')}`,
  )
  console.log(specificIncomeAndExpenses)

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

  // データが登録されていない
  if (!specificIncomeAndExpenses || specificIncomeAndExpenses.length === 0) {
    return (
      <Template title="月間レポート">
        <MonthControl
          year={selectedYear}
          month={selectedMonth}
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />
        <Typography variant="body1">
          {selectedYear}年{selectedMonth}月のデータはありません。
        </Typography>
      </Template>
    )
  }
  const { incomeDetails, expensesDetails } = specificIncomeAndExpenses[0]

  if (incomeDetails.length === 0 && expensesDetails.length === 0) {
    return (
      <Template title="月間レポート">
        <MonthControl
          year={selectedYear}
          month={selectedMonth}
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />
        <Typography variant="h4" sx={{ m: 1 }}>
          {selectedYear}年{selectedMonth}月
        </Typography>
        <Typography variant="body1">データがありません。</Typography>
      </Template>
    )
  }

  const incomeCategoriesData = {
    labels: Object.keys(incomeDetails ?? {}),
    datasets: [
      {
        label: 'カテゴリ',
        data: Object.values<number>(incomeDetails ?? {}),
        backgroundColor: 'rgba(0, 171, 85, 0.9)',
        barPercentage: 0.9,
        borderRadius: 10,
        skipNull: true,
      },
    ],
  }

  const expensesCategoriesData = {
    labels: Object.keys(expensesDetails ?? {}),
    datasets: [
      {
        label: 'カテゴリ',
        data: Object.values<number>(expensesDetails ?? {}),
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
        year={selectedYear}
        month={selectedMonth}
        setYear={setSelectedYear}
        setMonth={setSelectedMonth}
      />
      <Typography variant="h4" sx={{ m: 1 }}>
        {selectedYear}年{selectedMonth}月
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Typography variant="h5" sx={{ p: 2 }}>
              収入
            </Typography>
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
            <Typography variant="h5" sx={{ p: 2 }}>
              支出
            </Typography>
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
