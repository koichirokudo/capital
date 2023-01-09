import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
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
import {
  formatCategoryType,
  formatDBDate,
  formatMoney,
  formatStatus,
} from 'utils/format'
import { ApiContext, Capital, CapitalHistory, User } from 'types'
import getAllUsers from 'services/users/get-all-users'
import getAllCapitalHistory from 'services/capitals/get-all-capital-history'
import getUser from 'services/users/get-user'
import getAllCapitals from 'services/capitals/get-all-capitals'
import LineChart from 'components/LineChart'

type DashboardPageProps = InferGetStaticPropsType<typeof getStaticProps>

const INCOME = 0
const OUTGO = 1

const DashboardPage: NextPage = ({
  user,
  users,
  capitals,
  capitalHistory,
}: DashboardPageProps) => {
  // TODO:アクセス権限
  // 認証できない場合は、ログインページへ遷移
  useAuthGaurd()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const income: number[] = [400000, 420000, 380000, 510000, 300000]

  const outgo: number[] = [106771, 137302, 145002, 112000, 98000]

  const incomeGraphData = {
    labels: [],
    datasets: [
      {
        label: 'income',
        data: income,
        borderColor: 'rgba(144, 238, 144,1)',
        backgroundColor: 'rgba(144, 238, 144, 0.3)',
      },
    ],
  }

  const outgoGraphData = {
    labels: [],
    datasets: [
      {
        label: 'outgo',
        data: outgo,
        borderColor: 'rgba(144, 238, 144,1)',
        backgroundColor: 'rgba(144, 238, 144, 0.3)',
      },
    ],
  }

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

  return (
    <Template title="ダッシュボード">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              今月の収入
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              {formatMoney('400000')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              今月の支出
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              {formatMoney('106771')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" color="#a9a9a9">
              今月の清算
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '2rem' }}>
              {formatMoney('63421')}
            </Typography>
          </Paper>
        </Grid>
        {/* FixMe: SP時のテーブルスクロールバーが消える */}
        <Grid item xs={12} md={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              今年の収入
            </Typography>
            <LineChart data={incomeGraphData} height={30} width={100} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              今年の支出
            </Typography>
            <LineChart data={outgoGraphData} height={30} width={100} />
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
                    ? capitalHistory?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                    : capitalHistory
                  )?.map((capitalHistory: CapitalHistory, index: number) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {formatStatus(capitalHistory.status)}
                      </TableCell>
                      <TableCell>
                        {formatDBDate(capitalHistory.createAt)}
                      </TableCell>
                      <TableCell>
                        {users.map((user: User) => {
                          if (user.id === capitalHistory.userId) {
                            return user.userName
                          }
                        })}
                      </TableCell>
                      <TableCell>
                        {formatCategoryType(capitalHistory.categoryType)}
                      </TableCell>
                      <TableCell>{capitalHistory.category}</TableCell>
                      <TableCell>{formatMoney(capitalHistory.money)}</TableCell>
                      <TableCell>{capitalHistory.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={capitalHistory?.length}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
  }

  const users = await getAllUsers(context)
  const paths = users.map((user) => `/dashboards/${user.groupId}/${user.id}`)

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
  }

  if (!params) {
    throw new Error('params is undefined')
  }

  // 収支情報を取得して、静的ページを作成する
  // 10秒でstaleな状態にして、静的ページを更新する
  const groupId = Number(params.groupid)
  const userId = Number(params.userid)
  const [user, users, capitals, capitalHistory] = await Promise.all([
    getUser(context, { id: userId }),
    getAllUsers(context, { groupId: groupId }),
    getAllCapitals(context, { userId: userId }),
    getAllCapitalHistory(context, {
      groupId: groupId,
    }),
  ])

  return {
    props: {
      user: user ?? [],
      users: users ?? [],
      capitals: capitals ?? [],
      capitalHistory: capitalHistory ?? [],
    },
    revalidate: 10,
  }
}

export default DashboardPage
