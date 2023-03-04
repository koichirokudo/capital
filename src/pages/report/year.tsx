import {
  AccountBalanceWalletSharp,
  ArrowBackIos,
  ArrowForwardIos,
  CallMadeSharp,
  CallReceivedSharp,
} from '@mui/icons-material'
import { Avatar, Box, Grid, IconButton, Paper, Typography } from '@mui/material'
import { BarChart } from 'components/BarChart'
import LineChart from 'components/LineChart'
import Template from 'components/Templates'
import { monthlyLabels } from 'const'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import getAllCapitals from 'services/capitals/get-all-capitals'
import { ApiContext } from 'types'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'

type MonthlyPageProps = InferGetStaticPropsType<typeof getStaticProps>

const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

// eslint-disable-next-line no-unused-vars
const MonthlyPage: NextPage = ({ capitals: initial }: MonthlyPageProps) => {
  // 認証ガード
  useAuthGaurd()

  // const router = useRouter()
  // const { authUser } = useAuthContext()
  // const groupId = authUser?.groupId
  // const data = useAllCapital(context, { groupId, initial })
  // const capitals = data.capitals ?? initial

  // TODO: backend からとってくる
  const incomeMonthly = [
    420000, 438900, 387908, 459869, 678755, 365678, 689659, 765432, 300000,
    550000, 432870, 419865,
  ]

  const outgoMonthly = [
    220000, 238900, 287908, 259869, 378755, 245678, 289659, 265432, 200000,
    200000, 189987, 235697,
  ]

  const balanceMonthly = []
  for (let i = 0; i < incomeMonthly.length; i++) {
    balanceMonthly.push(incomeMonthly[i] - outgoMonthly[i])
  }

  const incomeTotal = incomeMonthly.reduce((ac, cv) => ac + cv)
  const outgoTotal = outgoMonthly.reduce((ac, cv) => ac + cv)

  const barChartOptions = {
    plugins: {
      legend: {
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 14,
            weight: 'bold',
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
          return formatMoney(value.toString(), true)
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
        grid: {
          display: false,
        },
      },
    },
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enable: true,
        displayColors: false,
        callbacks: {
          label: function (context: { parsed: { y: number | bigint | null } }) {
            let label = ''
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        fill: 'start',
      },
      point: {
        radius: 0,
        pointStyle: 'circle',
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: 'rgba(0,171,85, 0.7)',
        hitRadius: 70,
        hoverRadius: 4,
        hoverBorderWidth: 2,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        suggestedMin: 50,
        suggestedMax: 100,
        grid: {
          display: false,
        },
      },
    },
  }

  const lineChartIncomeData = {
    labels: monthlyLabels,
    datasets: [
      {
        data: incomeMonthly,
        tension: 0.3,
        borderColor: 'rgba(0, 171, 85, 1)',
        backgroundColor: 'rgba(0, 171, 85, 0.3)',
      },
    ],
  }

  const lineChartOutgoData = {
    labels: monthlyLabels,
    datasets: [
      {
        data: outgoMonthly,
        tension: 0.3,
        borderColor: 'rgba(255, 171, 0, 1)',
        backgroundColor: 'rgba(255, 171, 0, 0.3)',
      },
    ],
  }

  const lineChartBalanceData = {
    labels: monthlyLabels,
    datasets: [
      {
        data: balanceMonthly,
        tension: 0.3,
        borderColor: 'rgba(56, 123, 145, 1)',
        backgroundColor: 'rgba(56, 123, 145, 0.3)',
      },
    ],
  }

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: '収入',
        data: incomeMonthly,
        backgroundColor: 'rgba(0, 171, 85, 0.9)',
        barPercentage: 0.5,
        borderRadius: 10,
      },
      {
        label: '支出',
        data: outgoMonthly,
        backgroundColor: 'rgba(255, 171, 0, 0.9)',
        barPercentage: 0.5,
        borderRadius: 10,
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
        <Grid item xs={12} md={12} lg={4}>
          <Paper
            sx={{
              backgroundColor: '#C8FACD',
              positions: 'relative',
            }}
          >
            <Typography color="#015249" sx={{ p: 2, fontWeight: 'bold' }}>
              収入
            </Typography>
            <Box
              color="#015249"
              sx={{ ml: 3, fontSize: '2rem', fontWeight: 'bold' }}
            >
              {formatMoney(incomeTotal, true)}
            </Box>
            <Avatar
              sx={{
                backgroundColor: '#007B55',
                positions: 'absolute',
                top: '-80px',
                left: 'calc(100% - 60px)',
              }}
            >
              <CallReceivedSharp />
            </Avatar>
            <LineChart
              data={lineChartIncomeData}
              options={lineChartOptions}
              width={50}
              height={25}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper
            sx={{
              backgroundColor: '#FFF5CC',
              positions: 'relative',
            }}
          >
            <Typography color="#7A4100" sx={{ p: 2, fontWeight: 'bold' }}>
              支出
            </Typography>
            <Box
              color="#7a4100"
              sx={{ ml: 3, fontSize: '2rem', fontWeight: 'bold' }}
            >
              {formatMoney(outgoTotal, true)}
            </Box>
            <Avatar
              sx={{
                backgroundColor: '#B76E00',
                positions: 'absolute',
                top: '-80px',
                left: 'calc(100% - 60px)',
              }}
            >
              <CallMadeSharp />
            </Avatar>
            <LineChart
              data={lineChartOutgoData}
              options={lineChartOptions}
              width={50}
              height={25}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper
            sx={{
              backgroundColor: '#D2F3FE',
              positions: 'relative',
            }}
          >
            <Typography color="#275f72" sx={{ p: 2, fontWeight: 'bold' }}>
              残高
            </Typography>
            <Box
              color="#275f72"
              sx={{ ml: 3, fontSize: '2rem', fontWeight: 'bold' }}
            >
              {formatMoney(incomeTotal - outgoTotal, true)}
            </Box>
            <Avatar
              sx={{
                backgroundColor: '#387b91',
                positions: 'absolute',
                top: '-80px',
                left: 'calc(100% - 60px)',
              }}
            >
              <AccountBalanceWalletSharp />
            </Avatar>
            <LineChart
              data={lineChartBalanceData}
              options={lineChartOptions}
              width={50}
              height={25}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              収支グラフ
            </Typography>
            <BarChart
              data={monthlyData}
              options={barChartOptions}
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
