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
import { FinancialTransactions } from 'types'
import { adjustTimezone, formattedISO8601, getFullDate } from 'utils/format'
import { EXPENSES, INCOME } from 'const'

export type CapitalFormData = {
  userId: number
  userGroupId: number
  date: string
  share: boolean
  financialTransactionId: number
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
  const { data: incomeItem } = useSWR<FinancialTransactions[]>(
    `/api/financial-transactions?type=${INCOME}`,
    (url) => fetch(url).then((res) => res.json()),
  )
  const { data: expensesItem } = useSWR<FinancialTransactions[]>(
    `/api/financial-transactions?type=${EXPENSES}`,
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
      capitalType: INCOME.toString(),
      date: getFullDate(new Date()),
      financialTransactionId: 1,
      money: '0',
      note: '',
    },
  })

  const [selectItems, setSelectItems] = React.useState<FinancialTransactions[]>([])

  React.useEffect(() => {
    if (incomeItem && incomeItem.length > 0) {
      setSelectItems(incomeItem)
      setValue('financialTransactionId', incomeItem[0].id)
    }
  }, [incomeItem, setValue])

  // watch
  const capitalType = watch('capitalType', INCOME.toString())

  React.useEffect(() => {
    // FIXME:stringでないと制御できないのはどうして?
    if (capitalType === INCOME.toString() && incomeItem && incomeItem.length > 0) {
      setSelectItems(incomeItem)
      setValue('financialTransactionId', incomeItem[0].id)
    } else if (expensesItem && expensesItem.length > 0) {
      setSelectItems(expensesItem)
      setValue('financialTransactionId', expensesItem[0].id)
    }
  }, [capitalType, incomeItem, expensesItem, setValue])

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
                    value={INCOME.toString()}
                    control={<Radio required />}
                    label="収入"
                  />
                  <FormControlLabel
                    value={EXPENSES.toString()}
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
              name="financialTransactionId"
              control={control}
              rules={{ required: '収支項目を選択してください。' }}
              render={({ field }): JSX.Element => (
                <>
                  <InputLabel id="financialTransactionId">収支項目</InputLabel>
                  <Select
                    {...field}
                    data-testid="financialTransactionId-input"
                    label="financialTransactionId"
                    labelId="financialTransactionId"
                  >
                    {selectItems ? (
                      selectItems.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.label}
                          </MenuItem>
                        )
                      })
                    ) : (
                      <div>Loading...</div>
                    )}
                  </Select>
                  <FormHelperText>
                    {errors?.financialTransactionId?.message}
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
