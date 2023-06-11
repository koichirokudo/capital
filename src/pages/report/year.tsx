import { AccountBalanceWalletSharp, CallMadeSharp, CallReceivedSharp, } from '@mui/icons-material'
import { Avatar, Box, Grid, Paper, Typography } from '@mui/material'
import { BarChart } from 'components/BarChart'
import LineChart from 'components/LineChart'
import Template from 'components/Templates'
import { monthlyLabels } from 'const'
import type { GetStaticProps, NextPage } from 'next'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'
import YearControl from 'components/YearControl'
import useSWR from 'swr'
import { useAuthContext } from 'contexts/AuthContext'
import React from "react";

const ReportYearPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  const {authUser} = useAuthContext()

  // 今年をデフォルトにする
  const date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(date.getFullYear())
  const {data: incomeAndExpenses} = useSWR(
    authUser?.id ? `/api/year?user_id=${authUser?.id}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  if (!incomeAndExpenses) {
    return <div>Loading...</div>
  }

  // データが登録されていない
  if (incomeAndExpenses.length === 0) {
    return (
      <Template title="年間レポート">
        <YearControl year={selectedYear} setYear={setSelectedYear}/>
        <Typography variant="body1">{selectedYear}年のデータはありません。</Typography>
      </Template>
    )
  }

  const result = incomeAndExpenses.data.filter((item: { year: string }) => item.year === selectedYear.toString())[0] ?? null
  // 選択した年のデータがない
  if (!result) {
    return (
      <Template title="年間レポート">
        <YearControl year={selectedYear} setYear={setSelectedYear}/>
        <Typography variant="body1">{selectedYear}年のデータはありません。</Typography>
      </Template>
    )
  }

  const {incomeDetails, incomeTotal, expensesDetails, expensesTotal} = result
  const incomeMonthly = Object.values<number>(incomeDetails ?? [])
  const expensesMonthly = Object.values<number>(expensesDetails ?? [])
  const balanceMonthly: number[] = []
  for (let i = 0; i < incomeMonthly.length; i++) {
    balanceMonthly.push(incomeMonthly[i] - expensesMonthly[i])
  }

  const barChartOptions = {
    plugins: {
      legend: {
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 14,
            weight: 'bold' as const,
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
          weight: 'bold' as const,
        },
        anchor: 'end' as const,
        align: 'end' as const,
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
    elements: {
      line: {
        borderWidth: 3,
        fill: 'start',
      },
      point: {
        backgroundColor: 'rgba(0,171,85, 0.7)',
        borderColor: '#fff',
        borderWidth: 3,
        hitRadius: 70,
        hoverBorderWidth: 2,
        hoverRadius: 4,
        pointStyle: 'circle',
        radius: 0,
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
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
    },
    responsive: true,
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        suggestedMax: 100,
        suggestedMin: 50,
      },
    },
  }

  const lineChartIncomeData = {
    datasets: [
      {
        backgroundColor: 'rgba(0, 171, 85, 0.3)',
        borderColor: 'rgba(0, 171, 85, 1)',
        data: incomeMonthly,
        tension: 0.3,
      },
    ],
    labels: monthlyLabels,
  }

  const lineChartExpensesData = {
    datasets: [
      {
        backgroundColor: 'rgba(255, 171, 0, 0.3)',
        borderColor: 'rgba(255, 171, 0, 1)',
        data: expensesMonthly,
        tension: 0.3,
      },
    ],
    labels: monthlyLabels,
  }

  const lineChartBalanceData = {
    datasets: [
      {
        backgroundColor: 'rgba(56, 123, 145, 0.3)',
        borderColor: 'rgba(56, 123, 145, 1)',
        data: balanceMonthly,
        tension: 0.3,
      },
    ],
    labels: monthlyLabels,
  }

  const monthlyData = {
    datasets: [
      {
        backgroundColor: 'rgba(0, 171, 85, 0.9)',
        barPercentage: 0.5,
        borderRadius: 10,
        data: incomeMonthly,
        label: '収入',
      },
      {
        backgroundColor: 'rgba(255, 171, 0, 0.9)',
        barPercentage: 0.5,
        borderRadius: 10,
        data: expensesMonthly,
        label: '支出',
      },
    ],
    labels: monthlyLabels,
  }

  return (
    <Template title="年間レポート">
      <YearControl year={selectedYear} setYear={setSelectedYear}/>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={4}>
          <Paper
            sx={{
              backgroundColor: '#C8FACD',
              positions: 'relative',
            }}
          >
            <Typography color="#015249" sx={{p: 2, fontWeight: 'bold'}}>
              収入
            </Typography>
            <Box
              color="#015249"
              sx={{fontSize: '2rem', fontWeight: 'bold', ml: 3}}
            >
              {formatMoney(incomeTotal, true)}
            </Box>
            <Avatar
              sx={{
                backgroundColor: '#007B55',
                left: 'calc(100% - 60px)',
                positions: 'absolute',
                top: '-80px',
              }}
            >
              <CallReceivedSharp/>
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
            <Typography color="#7A4100" sx={{p: 2, fontWeight: 'bold'}}>
              支出
            </Typography>
            <Box
              color="#7a4100"
              sx={{fontSize: '2rem', fontWeight: 'bold', ml: 3}}
            >
              {formatMoney(expensesTotal, true)}
            </Box>
            <Avatar
              sx={{
                backgroundColor: '#B76E00',
                left: 'calc(100% - 60px)',
                positions: 'absolute',
                top: '-80px',
              }}
            >
              <CallMadeSharp/>
            </Avatar>
            <LineChart
              data={lineChartExpensesData}
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
            <Typography color="#275f72" sx={{p: 2, fontWeight: 'bold'}}>
              残高
            </Typography>
            <Box
              color="#275f72"
              sx={{fontSize: '2rem', fontWeight: 'bold', ml: 3}}
            >
              {formatMoney(incomeTotal - expensesTotal, true)}
            </Box>
            <Avatar
              sx={{
                backgroundColor: '#387b91',
                left: 'calc(100% - 60px)',
                positions: 'absolute',
                top: '-80px',
              }}
            >
              <AccountBalanceWalletSharp/>
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
          <Paper sx={{p: 2}}>
            <Typography sx={{fontWeight: 'bold'}}>収支グラフ</Typography>
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
  return {
    props: {},
  }
}

export default ReportYearPage
