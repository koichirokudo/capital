import { type GetStaticProps, NextPage } from 'next'
import Template from '../components/Templates'
import useCalculateCapital from '../services/capitals/use-calculate-capital'
import { useAuthGaurd } from '../utils/hook'
import React from 'react'
import MonthControl from '../components/MonthControl'
import { formatMoney } from '../utils/format'
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  Button,
  Box,
  AlertProps,
  Snackbar,
  Alert,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { Decision, FinalPayments } from '../types'
import { useSpinnerActionsContext } from '../contexts/SpinnerContext'
import decision from '../services/settlement/decision'
import { AxiosError } from 'axios'
import useSettlement from '../services/settlement/use-settlement'

type User = {
  id: number
  name: string
}

const CalculatePage: NextPage = () => {
  // 認証ガード
  useAuthGaurd()

  // 今月をデフォルトにする
  const date: Date = new Date()
  const [selectedYear, setSelectedYear] = React.useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(date.getMonth() + 1)
  const { paymentByCategory, paymentPlanTotal, users, isLoading, mutate } =
    useCalculateCapital(selectedYear, selectedMonth)
  const { settlement } = useSettlement(selectedYear, selectedMonth)
  const [settled, setSettled] = React.useState(settlement.length > 0)
  const setSpinner = useSpinnerActionsContext()
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  React.useEffect(() => {
    setSettled(settlement.length > 0)
  }, [settlement])

  const { handleSubmit } = useForm({
    defaultValues: {
      year: selectedYear,
      month: selectedMonth,
      payerId: 0,
      payeeId: 0,
      amount: 0,
    },
  })

  if (isLoading) {
    return (
      <Template title="精算">
        <p>Loading...</p>
      </Template>
    )
  }

  if (Object.keys(users).length == 1) {
    return (
      <Template title="精算">
        <MonthControl
          year={selectedYear}
          month={selectedMonth}
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />
        <Typography variant="h4" sx={{ p: 1 }}>
          {selectedYear}年{selectedMonth}月
        </Typography>
        <p>ユーザーが1人しかいないため精算できません</p>
      </Template>
    )
  }

  if (Object.keys(paymentByCategory).length == 0) {
    return (
      <Template title="精算">
        <MonthControl
          year={selectedYear}
          month={selectedMonth}
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />
        <Typography variant="h4" sx={{ p: 1 }}>
          {selectedYear}年{selectedMonth}月
        </Typography>
        <p>データがありません</p>
      </Template>
    )
  }

  const handleSave = async (data: Decision) => {
    const decisionData = {
      year: data.year,
      month: data.month,
      payerId: data.payerId,
      payeeId: data.payeeId,
      amount: data.amount,
    }

    try {
      setSpinner(true)
      await decision(decisionData)
      await mutate()
      setSnackbar({
        children: '精算が完了しました',
        severity: 'success',
      })
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setSnackbar({
          children: '精算に失敗しました。もう一度やり直してください。',
          severity: 'error',
        })
      }
    } finally {
      setTimeout(() => {
        setSpinner(false)
      }, 500)
    }
  }

  const onSubmit = async (data: {
    year: number
    month: number
    payerId: number
    payeeId: number
    amount: number
  }) => {

    if (!window.confirm('精算を実行しますか？')) {
      return
    }

    data.year = selectedYear
    data.month = selectedMonth
    data.payerId = finalPayments.fromId
    data.payeeId = finalPayments.toId
    data.amount = finalPayments.amount
    handleSave && handleSave(data)
    setSettled(true)
  }

  const handleCloseSnackbar = () => setSnackbar(null)

  // 各ユーザーが支払うべき金額を計算
  let finalPayments: FinalPayments = {
    fromId: 0,
    fromName: '',
    toId: 0,
    toName: '',
    amount: 0,
  }
  Object(users).map((user1: User) => {
    Object(users).map((user2: User) => {
      if (user1.id !== user2.id) {
        if (paymentPlanTotal[user1.name] > paymentPlanTotal[user2.name]) {
          finalPayments = {
            fromId: user1.id,
            fromName: user1.name,
            toId: user2.id,
            toName: user2.name,
            amount: paymentPlanTotal[user1.name] - paymentPlanTotal[user2.name],
          }
        } else if (
          paymentPlanTotal[user1.name] < paymentPlanTotal[user2.name]
        ) {
          finalPayments = {
            fromId: user2.id,
            fromName: user2.name,
            toId: user1.id,
            toName: user1.name,
            amount: paymentPlanTotal[user2.name] - paymentPlanTotal[user1.name],
          }
        } else {
          finalPayments = {
            fromId: user1.id,
            fromName: user1.name,
            toId: user2.id,
            toName: user2.name,
            amount: 0,
          }
        }
      }
    })
  })

  return (
    <Template title="精算">
      <MonthControl
        year={selectedYear}
        month={selectedMonth}
        setYear={setSelectedYear}
        setMonth={setSelectedMonth}
      />
      <Typography variant="h4" sx={{ p: 1 }}>
        {selectedYear}年{selectedMonth}月
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h5" sx={{ p: 2 }}>
              カテゴリごとの支払い
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>カテゴリ</TableCell>
                  {Object(users).map((user: User) => (
                    <TableCell key={user.id}>{user.name}</TableCell>
                  ))}
                  <TableCell>支払い合計</TableCell>
                  <TableCell>1人あたりの支払金額</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(paymentByCategory).map((key) => {
                  const payment = paymentByCategory[key]
                  return (
                    <TableRow key={key}>
                      <TableCell>{payment.label}</TableCell>
                      {Object(users).map((user: User) => (
                        <TableCell key={user.id}>
                          {formatMoney(payment.paid[user.name], true)}
                        </TableCell>
                      ))}
                      <TableCell>
                        {formatMoney(payment.paid.total, true)}
                      </TableCell>
                      <TableCell>
                        {formatMoney(payment.paid.perPerson, true)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h5" sx={{ p: 2 }}>
              ユーザーごとの支払い
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>カテゴリ</TableCell>
                  {Object(users).map((user: User) => (
                    <TableCell key={user.id}>{user.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(paymentByCategory).map((key) => {
                  const payment = paymentByCategory[key]
                  return (
                    <TableRow key={key}>
                      <TableCell>{payment.label}</TableCell>
                      {Object(users).map((user: User) => (
                        <TableCell key={user.id}>
                          {formatMoney(payment.paymentPlan[user.name], true)}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell>合計</TableCell>
                  {Object(users).map((user: User) => (
                    <TableCell key={user.id}>
                      {formatMoney(paymentPlanTotal[user.name], true)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Box component="div" sx={{ p: 2, color: settled ? 'grey' : 'black' }}>
          <Typography variant="h6">
            {selectedYear}年{selectedMonth}月の精算結果
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
            {finalPayments.fromName} から {finalPayments.toName} に{' '}
            <Box component="span" sx={{ fontSize: 20, fontWeight: 600 }}>
              {formatMoney(finalPayments.amount)}
            </Box>{' '}
            円支払う
          </Typography>
          <Typography variant="body1">
            精算を実行すると{selectedYear}年{selectedMonth}
            月の収支が確定します。
            <br />
            収支が確定すると、収支情報は編集できなくなります。
            <br />
            収支情報を確認してから精算してください。
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={settled}
          >
            精算{settled ? '済み' : ''}
          </Button>
        </Box>
      </form>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Template>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 10,
  }
}

export default CalculatePage
