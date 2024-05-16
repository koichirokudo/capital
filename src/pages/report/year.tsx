import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import TableRowComponent from 'components/TableRowComponent'
import LineChart from 'components/LineChart'
import Template from 'components/Templates'
import { monthlyLabels } from 'const'
import type { GetStaticProps, NextPage } from 'next'
import { formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'
import YearControl from 'components/YearControl'
import useSWR from 'swr'
import React from 'react'

const ReportYearPage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  // 今年をデフォルトにする
  const date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(date.getFullYear())
  const { data: incomeAndExpenses } = useSWR('/api/year', (url) =>
    fetch(url).then((res) => res.json()),
  )

  if (!incomeAndExpenses) {
    return <div>Loading...</div>
  }

  // データが登録されていない
  if (incomeAndExpenses.length === 0) {
    return (
      <Template title="年間レポート">
        <YearControl year={selectedYear} setYear={setSelectedYear} />
        <Typography variant="h4" sx={{ m: 1 }}>
          {selectedYear}年
        </Typography>
        <Typography variant="body1">
          データがありません。
        </Typography>
      </Template>
    )
  }

  const result =
    incomeAndExpenses.data.filter(
      (item: { year: string }) => item.year === selectedYear.toString(),
    )[0] ?? null
  // 選択した年のデータがない
  if (!result) {
    return (
      <Template title="年間レポート">
        <YearControl year={selectedYear} setYear={setSelectedYear} />
        <Typography variant="h4" sx={{ m: 1 }}>
          {selectedYear}年
        </Typography>
        <Typography variant="body1">
          データがありません。
        </Typography>
      </Template>
    )
  }

  const { incomeDetails, incomeTotal, expensesDetails, expensesTotal } = result
  const incomeMonthly = Object.values<number>(incomeDetails ?? [])
  const expensesMonthly = Object.values<number>(expensesDetails ?? [])
  const balanceMonthly: number[] = []
  for (let i = 0; i < incomeMonthly.length; i++) {
    balanceMonthly.push(incomeMonthly[i] - expensesMonthly[i])
  }

  const lineChartOptions = {
    elements: {
      line: {
        borderWidth: 3,
        fill: 'start',
      },
      point: {
        borderWidth: 3,
        hitRadius: 70,
      },
    },
    plugins: {
      datalabels: {
        color: '#000',
        display: true,
        anchor: 'end' as const,
        align: 'end' as const,
        formatter: function (value: { toString: () => string | number }) {
          return formatMoney(value.toString(), true)
        },
      },
      legend: {
        display: true,
      },
      tooltip: {
        enable: true,
        displayColors: true,
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
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
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
        label: '収入',
        backgroundColor: 'rgba(0, 171, 85, 0.3)',
        borderColor: 'rgba(0, 171, 85, 1)',
        data: incomeMonthly,
        tension: 0.2,
      },
      {
        label: '支出',
        backgroundColor: 'rgba(255, 171, 0, 0.3)',
        borderColor: 'rgba(255, 171, 0, 1)',
        data: expensesMonthly,
        tension: 0.2,
      },
    ],
    labels: monthlyLabels,
  }

  return (
    <Template title="年間レポート">
      <YearControl year={selectedYear} setYear={setSelectedYear} />
      <Typography variant="h4" sx={{ m: 1 }}>
        {selectedYear}年
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            sx={{
              backgroundColor: '#FFFFFF',
              p: 2,
              positions: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box
                color="#015249"
                sx={{ fontSize: '1.25rem', fontWeight: 'bold', mr: 2 }}
              >
                収入：
                {formatMoney(incomeTotal, true)}
              </Box>
              <Box
                color="#7a4100"
                sx={{ fontSize: '1.25rem', fontWeight: 'bold', mr: 2 }}
              >
                支出：
                {formatMoney(expensesTotal, true)}
              </Box>
              <Box
                color="#275f72"
                sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                残高：
                {formatMoney(incomeTotal - expensesTotal, true)}
              </Box>
            </Box>
            <LineChart
              data={lineChartIncomeData}
              options={lineChartOptions}
              width={40}
              height={15}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                月別収支
              </Typography>
            </Box>
            <Table sx={{ minWidth: 800 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {monthlyLabels.map((label) => (
                    <TableCell align="left" key={label}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRowComponent label="収入" values={incomeMonthly} />
                <TableRowComponent label="支出" values={expensesMonthly} />
                <TableRowComponent label="残高" values={balanceMonthly} />
              </TableBody>
            </Table>
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
