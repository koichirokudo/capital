import { Grid, Paper, Typography } from '@mui/material'
import { BarChart } from 'components/BarChart'
// import { Categories } from 'components/CategoryList'
import MonthControl from 'components/MonthControl'
import Template from 'components/Templates'
import { MONTH_LIST, YEAR_LIMIT } from 'const'
import type {
  GetStaticProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { ApiContext } from 'types'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'
import { useAuthContext } from "../../contexts/AuthContext";
import React from "react";
import useSWR from "swr";

const INCOME = '収入'
const EXPENSE = '支出'

const ReportMonthPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  const {authUser} = useAuthContext()

  // 今月をデフォルトにする
  const date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(date.getMonth() + 1)

  const {data: incomeAndExpenses} = useSWR(
    authUser?.id ? `/api/month?user_id=${authUser?.id}` : null,
    (url) => fetch(url).then((res) => res.json())
  )
  // const specificIncomeAndExpenses = incomeAndExpenses.filter(
  //   (item: { year: number; month: number }) =>
  //     item.year === year && item.month === month,
  // )
  //
  // // データが登録されていない
  // if (specificIncomeAndExpenses.length === 0) {
  //   return (
  //     <Template title="月間レポート">
  //       <MonthControl year={year} month={month} />
  //       <Typography variant="body1">
  //         {year}年{month}月のデータはありません。
  //       </Typography>
  //     </Template>
  //   )
  // }
  //
  // const incomeCategories = Categories.filter(
  //   (c) => c.capitalType === INCOME,
  // ).map((c) => c.category)
  //
  // const expensesCategories = Categories.filter(
  //   (c) => c.capitalType === EXPENSE,
  // ).map((c) => c.category)
  //
  // const options = {
  //   indexAxis: 'y' as const,
  //   skipNull: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     tooltip: {
  //       enabled: false,
  //     },
  //     datalabels: {
  //       display: true,
  //       font: {
  //         size: 10,
  //         weight: 600,
  //       },
  //       formatter: function (value: { toString: () => string | number }) {
  //         if (Number(value) > 0) {
  //           return formatMoney(value.toString(), true)
  //         } else {
  //           return null
  //         }
  //       },
  //     },
  //   },
  //   scales: {
  //     x: {
  //       display: true,
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         font: {
  //           size: 14,
  //         },
  //       },
  //     },
  //     y: {
  //       display: true,
  //       beginAtZero: true,
  //       grid: {
  //         display: false,
  //       },
  //     },
  //   },
  // }
  //
  // const { incomeDetails, expensesDetails } = specificIncomeAndExpenses[0]
  // const categoryIncomeData = Object.values<number>(incomeDetails ?? [])
  // const categoryExpensesData = Object.values<number>(expensesDetails ?? [])
  //
  // const incomeCategoriesData = {
  //   labels: incomeCategories,
  //   datasets: [
  //     {
  //       label: 'カテゴリ',
  //       data: categoryIncomeData,
  //       backgroundColor: 'rgba(0, 171, 85, 0.9)',
  //       barPercentage: 0.9,
  //       borderRadius: 10,
  //       skipNull: true,
  //     },
  //   ],
  // }
  //
  // const expensesCategoriesData = {
  //   labels: expensesCategories,
  //   datasets: [
  //     {
  //       label: 'カテゴリ',
  //       data: categoryExpensesData,
  //       backgroundColor: 'rgba(255, 171, 0, 0.9)',
  //       barPercentage: 0.9,
  //       borderRadius: 10,
  //       skipNull: true,
  //     },
  //   ],
  // }
  //
  // return (
  //   <Template title="月間レポート">
  //     <MonthControl year={year} month={month} />
  //     <Grid container spacing={2} justifyContent="center">
  //       <Grid item xs={12} md={12} lg={12}>
  //         <Paper>
  //           <BarChart
  //             data={incomeCategoriesData}
  //             options={options}
  //             height={200}
  //             width={1200}
  //           />
  //         </Paper>
  //       </Grid>
  //       <Grid item xs={12} md={12} lg={12}>
  //         <Paper>
  //           <BarChart
  //             data={expensesCategoriesData}
  //             options={options}
  //             height={500}
  //             width={1200}
  //           />
  //         </Paper>
  //       </Grid>
  //     </Grid>
  //   </Template>
  // )
  //
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

export default ReportMonthPage
