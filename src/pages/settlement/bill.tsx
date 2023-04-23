import {
  Checkbox,
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
import Template from 'components/Templates'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import React from 'react'
import checkAuth from 'services/auth/check-auth'
import getSettlements from 'services/settlement/get-settlements'
import getAllUsers from 'services/users/get-all-users'
import theme from 'theme'
import { ApiContext, Settlement, User } from 'types'
import { formatMoney } from 'utils/format'

const context: ApiContext = {
  apiRootUrl: process.env.API_BASE_URL || 'http://localhost:8000',
}

type BillProps = InferGetStaticPropsType<typeof getStaticProps>

const formatPaidStatus = (status: string) => {
  switch (status) {
    case 'unpaid':
      return (
        <Typography variant="overline" color={theme.palette.error.main}>
          未払い
        </Typography>
      )
    case 'paid':
      return (
        <Typography variant="overline" color={theme.palette.success.main}>
          支払済み
        </Typography>
      )
    default:
      return (
        <Typography variant="overline" color={theme.palette.error.main}>
          未払い
        </Typography>
      )
  }
}

const Bill: NextPage = ({ users, settlement }: BillProps) => {
  const [selected, setSelected] = React.useState([])
  const [rowCount, setRowCount] = React.useState(0)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(12)

  console.log(users)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = settlement.map((row: { id: number }) =>
        String(row.id),
      )
      setSelected(newSelected)
      setRowCount(newSelected.length)
      return
    }
    setSelected([])
    setRowCount(0)
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id as never)
    let newSelected: never[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id as never)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
    setRowCount(newSelected.length)
  }

  const isSelected = (id: string) => selected.indexOf(id as never) !== -1

  return (
    <Template title="精算">
      <Paper sx={{ width: '50%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={rowCount > 0 && rowCount === selected.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>年</TableCell>
                <TableCell>月</TableCell>
                {users.map((user: User) => (
                  <TableCell key={user.id} padding="none">
                    {user.name}
                  </TableCell>
                ))}
                <TableCell>支払い合計</TableCell>
                <TableCell>ステータス</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settlement.map((row: Settlement) => {
                const isItemSelected = isSelected(String(row.id))
                return (
                  <TableRow
                    key={row.id}
                    onClick={(event) => handleClick(event, String(row.id))}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    {row.users.map((user, index) => (
                      <TableCell key={index}>
                        {formatMoney(user.amount)}
                      </TableCell>
                    ))}
                    <TableCell>{formatMoney(row.totalAmount)}</TableCell>
                    <TableCell>{formatPaidStatus(row.status)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          count={settlement.length}
          rowsPerPageOptions={[12, 24, 36]}
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="表示件数"
        />
      </Paper>
    </Template>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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

  const groupId = authUser.groupId
  const [users, settlement] = await Promise.all([
    await getAllUsers(context, { groupId }),
    await getSettlements(context, { groupId }),
  ])

  return {
    props: {
      users: users ?? [],
      settlement: settlement ?? [],
    },
    revalidate: 10,
  }
}

export default Bill
