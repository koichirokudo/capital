import {
  ArrowBackIos,
  ArrowForwardIos,
  CurrencyYenOutlined,
  PaymentsSharp,
  RestaurantSharp,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Stack,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import {
  blue,
  deepOrange,
  deepPurple,
  green,
  orange,
  red,
} from '@mui/material/colors'
import { fontWeight } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import Template from 'components/Templates'
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import React from 'react'
import getAllCapitals from 'services/capitals/get-all-capitals'
import getAllUsers from 'services/users/get-all-users'
import { ApiContext, Calculate, Capital, User } from 'types'
import { formatDBDate, formatMoney } from 'utils/format'
import { useAuthGaurd } from 'utils/hook'

interface TabPanelProps {
  data?: any
  index: number
  value: number
  targetUser: number
}

const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

type CalculatePageProps = InferGetStaticPropsType<typeof getStaticProps>

const avatarColor = [
  {
    backgroundColor: orange[500],
  },
  {
    backgroundColor: red[500],
  },
  {
    backgroundColor: blue[500],
  },
  {
    backgroundColor: green[500],
  },
  {
    backgroundColor: deepOrange[500],
  },
  {
    backgroundColor: deepPurple[500],
  },
]

const random = (): number => {
  return Math.floor(Math.random() * 6)
}

// -----------------------
const TabPanel = (props: TabPanelProps) => {
  const { data, value, index, targetUser } = props
  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 200,
    },
    {
      field: 'member',
      headerName: 'メンバー',
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Avatar src={params.value.avatar} sx={{ mr: 3 }} />
            {params.value.memberName}
          </>
        )
      },
    },
    {
      field: 'outgo',
      type: 'number',
      headerName: '支払い',
      width: 200,
    },
    { field: 'income', type: 'number', headerName: '受け取り', width: 200 },
    {
      field: 'total',
      type: 'number',
      headerName: '支払い',
      width: 200,
    },
  ]

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ mt: 1, height: '300px', width: '100%' }}>
          <DataGrid
            rows={data.filter((d: { userId: number }) => {
              if (d.userId === targetUser) return d
            })}
            getRowId={(row) => row.id}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
      )}
    </div>
  )
}

const CalculatePage: NextPage = ({ users, capitals }: CalculatePageProps) => {
  // 認証ガード
  useAuthGaurd()

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [value, setValue] = React.useState(1)

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#F3F6F8',
      color: theme.palette.common.black,
    },
  }))

  // TODO: 計算処理をしてdataに入れる
  // TODO: メンバーの支払い合計計算の処理
  // TODO: カテゴリにアイコン追加
  const data = [
    {
      id: 1,
      userId: 1,
      member: {
        memberName: '川合 藍',
        avatar: '/Avatar/2.png',
      },
      outgo: 10000,
      income: 10000,
      total: 30000,
    },
    {
      id: 2,
      userId: 2,
      member: {
        memberName: '三井 寿',
        avatar: '/Avatar/1.png',
      },
      outgo: 10000,
      income: 10000,
      total: 30000,
    },
  ]

  const handlePrevMonth = () => {
    console.log('prev month')
  }
  const handleNextMonth = () => {
    console.log('next month')
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

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  // TODO: prev next の css 調整
  return (
    <Template title="精算">
      <Stack direction="row" sx={{ mb: 1 }}>
        <IconButton
          color="primary"
          aria-label="back button"
          onClick={handlePrevMonth}
        >
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h6">2023年1月</Typography>
        <IconButton
          color="primary"
          aria-label="back button"
          onClick={handleNextMonth}
        >
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Stack direction="row" spacing={1} sx={{ p: 2 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#007B55' }}>
                <CurrencyYenOutlined />
              </Avatar>
              <Typography sx={{ pt: 1, fontWeight: 'bold' }}>
                みんなの支払い
              </Typography>
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ width: 180, fontSize: '1rem' }}>
                      カテゴリ
                    </StyledTableCell>
                    {users.map((user: { userName: string }) => {
                      return (
                        <StyledTableCell
                          style={{ width: 180, fontSize: '1rem' }}
                        >
                          {user.userName}
                        </StyledTableCell>
                      )
                    })}
                    <StyledTableCell style={{ width: 180, fontSize: '1rem' }}>
                      支払い合計
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 180, fontSize: '1rem' }}>
                      平均
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    const item = []
                    for (let i = 0; i < 5; i++) {
                      item.push(
                        <TableRow key={i}>
                          <TableCell>
                            <Stack direction="row">
                              <Avatar>
                                <RestaurantSharp />
                              </Avatar>
                              <Typography sx={{ mt: 1, ml: 2 }}>
                                食費
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ fontSize: '1rem' }}>
                            {formatMoney(10000, true)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '1rem' }}>
                            {formatMoney(10000, true)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '1rem' }}>
                            {formatMoney(20000, true)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '1rem' }}>
                            {formatMoney(10000, true)}
                          </TableCell>
                        </TableRow>,
                      )
                    }
                    return item
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={30}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Stack direction="row" spacing={1} sx={{ p: 2 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#007B55' }}>
                <PaymentsSharp />
              </Avatar>
              <Typography sx={{ pt: 1, fontWeight: 'bold' }}>
                メンバーごとの支払い
              </Typography>
            </Stack>
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="member tabs"
            >
              {users.map((user: User) => {
                return <Tab key={user.id} label={user.userName} />
              })}
            </Tabs>
            {users.map((user: User, index: number) => {
              return (
                <TabPanel
                  data={data}
                  value={value}
                  index={index}
                  targetUser={user.id}
                />
              )
            })}
          </Paper>
        </Grid>
      </Grid>
      <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
        精算する
      </Button>
    </Template>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await getAllUsers(context)
  const paths = users.map((user) => `/calculate/${user.groupId}`)

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  if (!params) {
    throw new Error('param is undefined')
  }

  const groupId = Number(params.groupid)
  const [users, capitals] = await Promise.all([
    await getAllUsers(context, { groupId: groupId }),
    await getAllCapitals(context, { groupId: groupId }),
  ])

  return {
    props: {
      users,
      capitals,
    },
    revalidate: 10,
  }
}

export default CalculatePage
