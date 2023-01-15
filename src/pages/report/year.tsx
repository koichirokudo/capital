import { Grid, IconButton, Paper, Typography } from '@mui/material'
import Template from 'components/Templates'
import { useAuthContext } from 'contexts/AuthContext'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import getAllCapitals from 'services/capitals/get-all-capitals'
import useAllCapital from 'services/capitals/use-all-capitals'
import { ApiContext } from 'types'
import { useAuthGaurd } from 'utils/hook'
import { BarChart } from 'components/BarChart'
import { formatMoney } from 'utils/format'
import { monthlyLabels } from 'const'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

type MonthlyPageProps = InferGetStaticPropsType<typeof getStaticProps>

const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

const MonthlyPage: NextPage = ({ capitals: initial }: MonthlyPageProps) => {
  // 認証ガード
  useAuthGaurd()

  const router = useRouter()
  const { authUser } = useAuthContext()
  const groupId = authUser?.groupId
  const data = useAllCapital(context, { groupId, initial })
  const capitals = data.capitals ?? initial

  // TODO: backend からとってくる
  const incomeMonthly = [
    420000, 438900, 387908, 459869, 678755, 245678, 689659, 765432, 300000,
    550000, 432870, 419865,
  ]

  const outgoMonthly = [
    220000, 238900, 287908, 259869, 378755, 245678, 289659, 265432, 200000,
    200000, 189987, 235697,
  ]

  const incomeTotal = incomeMonthly.reduce((ac, cv) => ac + cv)
  const outgoTotal = outgoMonthly.reduce((ac, cv) => ac + cv)
  const incomeAverage = Math.round(
    incomeMonthly.reduce((ac, cv) => ac + cv) / incomeMonthly.length,
  )
  const outgoAverage = Math.round(
    outgoMonthly.reduce((ac, cv) => ac + cv) / outgoMonthly.length,
  )

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
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
        anchor: 'end',
        align: 'end',
        formatter: function (value: { toString: () => string | number }) {
          return formatMoney(value.toString())
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
            size: 20,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
      },
    },
  }

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: '収入',
        data: incomeMonthly,
        borderColor: 'rgba(158, 206, 255,1)',
        backgroundColor: 'rgba(158, 206, 255, 0.8)',
      },
      {
        label: '支出',
        data: outgoMonthly,
        borderColor: 'rgba(235, 179, 179, 1)',
        backgroundColor: 'rgba(235, 179, 179, 0.8)',
      },
    ],
  }

  // TODO: あとで作る
  const handlePrevYear = () => {
    console.log('prev year')
  }

  const handleNextYear = () => {
    console.log('next year')
  }

  return (
    <Template title="年間レポート">
      <Typography variant="h4" sx={{ mb: 2 }}>
        <IconButton
          color="primary"
          aria-label="back button"
          component="title"
          onClick={handlePrevYear}
        >
          <ArrowBackIos />
        </IconButton>
        2023年
        <IconButton
          color="primary"
          aria-label="back button"
          component="title"
          onClick={handleNextYear}
        >
          <ArrowForwardIos />
        </IconButton>
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              収入
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              \ {formatMoney(incomeTotal)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              支出
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              \ {formatMoney(outgoTotal)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              残高
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              \ {formatMoney(incomeTotal - outgoTotal)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              平均収入
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              \ {formatMoney(incomeAverage)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={2.4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              平均支出
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              \ {formatMoney(outgoAverage)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ p: 2 }}>
            <BarChart
              data={monthlyData}
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

export default MonthlyPage
