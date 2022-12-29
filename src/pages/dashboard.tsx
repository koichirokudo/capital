import type { NextPage } from 'next'
import Template from 'components/Templates'
import * as React from 'react'
import { useAuthGaurd } from 'utils/hook'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { formatMoney } from 'utils/formatMoney'
import { Line } from 'react-chartjs-2'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  BarElement,
  BarController,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
)

const DashboardPage: NextPage = () => {
  // 認証できない場合は、ログインページへ遷移
  useAuthGaurd()

  // TODO: 更新履歴の表を作成する
  // TODO: グラフを作成する
  // TODO: use-capital api 収支情報のAPIを作成する
  // TODO: 更新履歴の取得APIを取得する

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  // あとで消す
  const createData = (
    status: string,
    date: string,
    user: string,
    categoryType: string,
    category: string,
    money: number,
    note: string,
  ) => {
    return { status, date, user, categoryType, category, money, note }
  }

  const rows = [
    createData(
      '登録',
      '2022/12/11 11:00:31',
      'テスト太郎',
      '収入',
      '給与',
      500000,
      '給料です。',
    ),
    createData(
      '登録',
      '2022/12/14 12:00:31',
      'テスト太郎',
      '収入',
      '給与',
      500001,
      '給料です。',
    ),
    createData(
      '登録',
      '2022/12/16 20:00:31',
      'テスト太郎',
      '収入',
      '給与',
      500002,
      '給料です。',
    ),
    createData(
      '登録',
      '2022/12/16 14:00:31',
      'テスト太郎',
      '収入',
      '給与',
      500003,
      '給料です。',
    ),
    createData(
      '登録',
      '2022/12/16 13:35:31',
      'テスト太郎',
      '収入',
      '給与',
      500004,
      '給料です。',
    ),
    createData(
      '登録',
      '2022/12/17 14:26:31',
      'テスト太郎',
      '収入',
      '給与',
      500005,
      '給料です。',
    ),
    createData(
      '登録',
      '2022/12/18 15:03:31',
      'テスト太郎',
      '収入',
      '給与',
      500006,
      '給料です。',
    ),
  ]

  // あとでコンポーネント化する
  const labels = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]
  const incomeGraphData = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [0.1, 0.4, 0.2, 0.3, 0.7, 0.4, 0.6, 0.3, 0.2, 0.9, 0.7, 0.9],
        borderColor: 'rgba(144, 238, 144,1)',
        backgroundColor: 'rgba(144, 238, 144, 0.3)',
      },
      {
        label: 'Dataset 2',
        data: [0.9, 0.5, 0.1, 0.3, 0.9, 0.6, 0.4, 0.1, 0.1, 0.6, 0.7, 0.6],
        borderColor: 'rgba(237, 145, 145, 1)',
        backgroundColor: 'rgba(237, 145, 145, 0.3)',
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        fill: 'start',
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  }

  return (
    <Template title="ダッシュボード">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              今月の収入
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              {formatMoney('1000000')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              今月の支出
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              {formatMoney('1000000')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              今月の清算
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              {formatMoney('1000000')}
            </Typography>
          </Paper>
        </Grid>
        {/* FixMe: SP時のテーブルスクロールバーが消える */}
        <Grid item xs={12} md={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              収入レポート
            </Typography>
            <Line
              data={incomeGraphData}
              options={options}
              width={100}
              height={30}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              支出レポート
            </Typography>
            <Line
              data={incomeGraphData}
              options={options}
              width={100}
              height={30}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              最近の更新履歴
            </Typography>
            <TableContainer>
              <Table sx={{ minWidth: 600 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>状態</TableCell>
                    <TableCell>日時</TableCell>
                    <TableCell>更新者</TableCell>
                    <TableCell>収支</TableCell>
                    <TableCell>カテゴリ</TableCell>
                    <TableCell>金額</TableCell>
                    <TableCell>メモ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                    : rows
                  ).map((row) => (
                    <TableRow key={row.status}>
                      <TableCell component="th" scope="row">
                        {row.status}
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.user}</TableCell>
                      <TableCell>{row.categoryType}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{formatMoney(row.money)}</TableCell>
                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Template>
  )
}

export default DashboardPage
