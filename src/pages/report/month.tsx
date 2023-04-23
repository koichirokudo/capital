import { Grid, Paper, Typography } from '@mui/material'
import { BarChart } from 'components/BarChart'
import { Categories } from 'components/CategoryList'
import MonthControl from 'components/MonthControl'
import Template from 'components/Templates'
import { MONTH_LIST, YEAR_LIMIT } from 'const'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import checkAuth from 'services/auth/check-auth'
import getMonthlyIncomeAndExpenses from 'services/month/get-monthly-income-and-expenses'
import { ApiContext } from 'types'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'

const INCOME = '収入'
const EXPENSE = '支出'
const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

type ReportMonthPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>

const ReportMonthPage: NextPage<ReportMonthPageProps> = ({
  year,
  month,
  incomeAndExpenses,
}: ReportMonthPageProps) => {
  // 認証ガード
  useAuthGaurd()

  const specificIncomeAndExpenses = incomeAndExpenses.filter(
    (item: { year: number; month: number }) =>
      item.year === year && item.month === month,
  )

  // データが登録されていない
  if (specificIncomeAndExpenses.length === 0) {
    return (
      <Template title="月間レポート">
        <MonthControl year={year} month={month} />
        <Typography variant="body1">
          {year}年{month}月のデータはありません。
        </Typography>
      </Template>
    )
  }

  const incomeCategories = Categories.filter(
    (c) => c.capitalType === INCOME,
  ).map((c) => c.category)

  const expensesCategories = Categories.filter(
    (c) => c.capitalType === EXPENSE,
  ).map((c) => c.category)

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
    labels: incomeCategories,
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
    labels: expensesCategories,
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
      <MonthControl year={year} month={month} />
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

export const getServerSideProps: GetServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  // 認証確認
  const authUser = await checkAuth(context)
  if (!authUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  if (!query || !query.year || !query.month) {
    return {
      notFound: true,
    }
  }

  const userId = authUser.id
  const year = parseInt(query.year as string, 10)
  const month = parseInt(query.month as string, 10)

  if (
    year < YEAR_LIMIT ||
    year > new Date().getFullYear() ||
    !MONTH_LIST.includes(month)
  ) {
    return {
      notFound: true,
    }
  }

  const incomeAndExpenses = await getMonthlyIncomeAndExpenses(context, {
    userId: userId,
  })

  return {
    props: {
      year: year,
      month: month,
      incomeAndExpenses: incomeAndExpenses ?? [],
    },
  }
}

export default ReportMonthPage
