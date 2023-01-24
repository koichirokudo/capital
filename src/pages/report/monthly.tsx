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
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

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
  console.log(outgoCategories)

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
          weight: 'bold',
        },
        formatter: function (
          value: { toString: () => string | number },
          chart: { dataset: any; dataIndex: any },
        ) {
          // const { dataset, dataIndex } = chart
          // console.log(dataset.data[dataIndex])
          // console.log(dataIndex)
          if (value > 0) {
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

  // TODO: backend から以下の形式でとってくる
  /*
  data: {
    datasets: [{
      data: [{category: '食費', money: 1000}, {category: '日用品', money: 1000}]
    }]
  }
}*/
  const categoryIncomeData = [420000, 438900, 387908, 459869, 678755, 245678]
  const categoryOutgoData = [420000, 438900, 387908, 459869, 678755, 245678]

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

  const outgoCategoriesData = {
    labels: outgoCategories,
    datasets: [
      {
        label: 'カテゴリ',
        data: categoryOutgoData,
        backgroundColor: 'rgba(255, 171, 0, 0.9)',
        barPercentage: 0.9,
        borderRadius: 10,
        skipNull: true,
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
