import { Box, Grid, IconButton, Paper, Typography } from '@mui/material'
import Template from 'components/Templates'
import { useAuthContext } from 'contexts/AuthContext'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import getAllCapitals from 'services/capitals/get-all-capitals'
import useAllCapital from 'services/capitals/use-all-capitals'
import { ApiContext } from 'types'
import { useAuthGaurd } from 'utils/hook'
import { BarChart } from 'components/BarChart'
import { formatMoney } from 'utils/format'
import { Categories } from 'components/CategoryList'
import {
  ArrowBackIos,
  ArrowBackIosNew,
  ArrowForwardIos,
} from '@mui/icons-material'

type CategoryPageProps = InferGetStaticPropsType<typeof getStaticProps>

const INCOME = '収入'
const OUTGO = '支出'
const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

const CategoryPage: NextPage = ({ capitals: initial }: CategoryPageProps) => {
  // 認証ガード
  useAuthGaurd()

  const { authUser } = useAuthContext()
  const groupId = authUser?.groupId
  const data = useAllCapital(context, { groupId, initial })
  const capitals = data.capitals ?? initial

  const incomeCategories = Categories.filter(
    (c) => c.capitalType === INCOME,
  ).map((c) => c.category)

  const outgoCategories = Categories.filter((c) => c.capitalType === OUTGO).map(
    (c) => c.category,
  )

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true,
        formatter: function (value: { toString: () => string | number }) {
          return formatMoney(value.toString())
        },
      },
    },
  }

  // TODO: backend からとってくる
  const categoryData = [420000, 438900, 387908, 459869, 678755, 245678]

  const incomeCategoriesData = {
    labels: incomeCategories,
    datasets: [
      {
        data: categoryData,
        borderColor: 'rgba(158, 206, 255,1)',
        backgroundColor: 'rgba(158, 206, 255, 0.8)',
      },
    ],
  }

  const outgoCategoriesData = {
    labels: outgoCategories,
    datasets: [
      {
        data: categoryData,
        borderColor: 'rgba(235, 179, 179, 1)',
        backgroundColor: 'rgba(235, 179, 179, 0.8)',
      },
    ],
  }

  // TODO: あとで作る
  const handlePrevMonth = () => {
    console.log('prev month')
  }
  const handleNextMonth = () => {
    console.log('next month')
  }

  return (
    <Template title="月間レポート">
      <Typography variant="h4" sx={{ mb: 2 }}>
        <IconButton
          color="primary"
          aria-label="back button"
          component="title"
          onClick={handlePrevMonth}
        >
          <ArrowBackIos />
        </IconButton>
        2023年1月
        <IconButton
          color="primary"
          aria-label="back button"
          component="title"
          onClick={handleNextMonth}
        >
          <ArrowForwardIos />
        </IconButton>
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">
              収入 {formatMoney(categoryData.reduce((ac, cv) => ac + cv))}円
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">
              支出 {formatMoney(categoryData.reduce((ac, cv) => ac + cv))}円
            </Typography>
            <BarChart
              data={outgoCategoriesData}
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
  const capitals = await getAllCapitals(context)

  return {
    props: {
      capitals,
    },
    revalidate: 30,
  }
}

export default CategoryPage
