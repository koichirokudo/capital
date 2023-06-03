/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ja } from 'date-fns/locale'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { ExpensesItem } from 'types'
import { adjustTimezone, formattedISO8601, getFullDate } from 'utils/format'

const EXPENSES = 0
const INCOME = 1

export type CapitalFormData = {
  userId: number
  groupId: number
  date: string
  share: boolean
  expensesItem: string
  capitalType: string
  note: string
  money: string
  settlement: boolean
  settlementAt: string
  createAt: string
  updateAt: string
}

interface CapitalFormProps {
  /**
   * 登録ボタンを押した時のイベントハンドラ
   */
  onCapitalSave?: (data: CapitalFormData) => void
}

/**
 * 収支投稿フォーム
 */
const CapitalForm = ({ onCapitalSave }: CapitalFormProps) => {
  const { data: income } = useSWR<ExpensesItem[]>(
    `/api/expenses-items?type=${INCOME}`,
    (url) => fetch(url).then((res) => res.json()),
  )
  const { data: expenses } = useSWR<ExpensesItem[]>(
    `/api/expenses-items?type=${EXPENSES}`,
    (url) => fetch(url).then((res) => res.json()),
  )
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CapitalFormData>({
    defaultValues: {
      capitalType: 'income',
      date: getFullDate(new Date()),
      expensesItem: '',
      money: '0',
      note: '',
    },
  })

  const [selectItems, setSelectItems] = React.useState<ExpensesItem[]>([])

  React.useEffect(() => {
    if (income) {
      setSelectItems(income)
      setValue('expensesItem', income[0].value)
    }
  }, [income, setValue])

  // watch
  const capitalType = watch('capitalType', 'income')

  React.useEffect(() => {
    if (capitalType === 'income' && income) {
      setSelectItems(income)
      setValue('expensesItem', income[0].value)
    } else if (expenses) {
      setSelectItems(expenses)
      setValue('expensesItem', expenses[0].value)
    }
  }, [capitalType, income, expenses, setValue])

  const onSubmit = (data: CapitalFormData) => {
    // UTCでシリアライズされた日付(2023-05-31T15:00:00.000Z)を
    // ISO8601(2023-05-31)に変換する
    const date = new Date(data.date)
    // タイムゾーンを調整
    adjustTimezone(date)
    data.date = formattedISO8601(date)
    onCapitalSave && onCapitalSave(data)
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            component="fieldset"
            error={errors?.hasOwnProperty('capitalType')}
          >
            <FormLabel component="legend">収支タイプ</FormLabel>
            <Controller
              aria-labelledby="capital-type-radio"
              name="capitalType"
              control={control}
              rules={{ required: '収支タイプを選択してください。' }}
              render={({ field }): JSX.Element => (
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="income"
                    control={<Radio required />}
                    label="収入"
                  />
                  <FormControlLabel
                    value="expenses"
                    control={<Radio required />}
                    label="支出"
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText>{errors?.capitalType?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth error={errors?.hasOwnProperty('date')}>
            <Controller
              name="date"
              control={control}
              rules={{ required: '日時を選択してください。' }}
              render={({ field }): JSX.Element => (
                <>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ja}
                  >
                    <DatePicker
                      {...field}
                      label="日時"
                      inputFormat="yyyy/MM/dd"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <FormHelperText>{errors?.date?.message}</FormHelperText>
                </>
              )}
            />
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            error={errors?.hasOwnProperty('category')}
          >
            <Controller
              name="expensesItem"
              control={control}
              rules={{ required: '収支項目を選択してください。' }}
              render={({ field }): JSX.Element => (
                <>
                  <InputLabel id="expensesItem">収支項目</InputLabel>
                  <Select
                    {...field}
                    data-testid="expensesItem-input"
                    label="expensesItem"
                    labelId="expensesItem"
                  >
                    {selectItems ? (
                      selectItems.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.value}>
                            {item.label}
                          </MenuItem>
                        )
                      })
                    ) : (
                      <div>Loading...</div>
                    )}
                  </Select>
                  <FormHelperText>
                    {errors?.expensesItem?.message}
                  </FormHelperText>
                </>
              )}
            />
          </FormControl>
          <Controller
            name="money"
            control={control}
            rules={{ required: '金額を入力してください。' }}
            render={({ field }): JSX.Element => (
              <TextField
                {...field}
                fullWidth
                inputProps={{ min: '0', max: '10000000' }}
                margin="normal"
                type="number"
                label="金額"
                error={errors?.hasOwnProperty('money')}
                helperText={errors?.money?.message}
              />
            )}
          />
          <Controller
            name="note"
            control={control}
            render={({ field }): JSX.Element => (
              <TextField
                {...field}
                fullWidth
                inputProps={{ maxLength: 10 }}
                margin="normal"
                type="text"
                label="メモ（10文字まで入力できます）"
              />
            )}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 'bold',
              height: 56,
            }}
          >
            登録
          </Button>
        </form>
      </Box>
    </Paper>
  )
}

export default CapitalForm
