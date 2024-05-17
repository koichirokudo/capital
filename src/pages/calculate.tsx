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
} from '@mui/material'
import { useForm } from 'react-hook-form'

type FinalPayments = {
  from: string
  to: string
  amount: number
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
  const { handleSubmit } = useForm({
    defaultValues: {
      year: selectedYear,
      month: selectedMonth,
    },
  })

  if (isLoading) {
    return (
      <Template title="精算">
        <p>Loading...</p>
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

  const onSubmit = async (data: {
    year: number
    month: number
    finalPayments: FinalPayments
  }) => {
    data.year = selectedYear
    data.month = selectedMonth
    data.finalPayments = finalPayments
    await mutate()
  }

  // 各ユーザーが支払うべき金額を計算
  let finalPayments: FinalPayments = {}
  Object.keys(users).map((user1) => {
    Object.keys(users).map((user2) => {
      if (user1 !== user2) {
        if (paymentPlanTotal[user1] > paymentPlanTotal[user2]) {
          finalPayments = {
            from: user1,
            to: user2,
            amount: paymentPlanTotal[user1] - paymentPlanTotal[user2],
          }
        } else if (paymentPlanTotal[user1] < paymentPlanTotal[user2]) {
          finalPayments = {
            from: user2,
            to: user1,
            amount: paymentPlanTotal[user2] - paymentPlanTotal[user1],
          }
        } else {
          finalPayments = {
            from: user1,
            to: user2,
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
                  {Object.keys(users).map((user) => (
                    <TableCell key={user}>{user}</TableCell>
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
                      {Object.keys(users).map((user) => (
                        <TableCell key={user}>
                          {formatMoney(payment.paid[user], true)}
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
                  {Object.keys(users).map((user) => (
                    <TableCell key={user}>{user}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(paymentByCategory).map((key) => {
                  const payment = paymentByCategory[key]
                  return (
                    <TableRow key={key}>
                      <TableCell>{payment.label}</TableCell>
                      {Object.keys(users).map((user) => (
                        <TableCell key={user}>
                          {formatMoney(payment.paymentPlan[user], true)}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell>合計</TableCell>
                  {Object.keys(users).map((user) => (
                    <TableCell key={user}>
                      {formatMoney(paymentPlanTotal[user], true)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Box component="div" sx={{ p: 2 }}>
          <Typography variant="h6">
            {selectedYear}年{selectedMonth}月の精算結果
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
            {finalPayments.from} から {finalPayments.to} に{' '}
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
          >
            精算
          </Button>
        </Box>
      </form>
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
