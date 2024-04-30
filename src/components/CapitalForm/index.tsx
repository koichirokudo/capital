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
import { FinancialTransactions } from 'types'
import { adjustTimezone, formattedISO8601, getFullDate } from 'utils/format'
import { EXPENSES, INCOME } from 'const'
import { useFinancialTransactionsContext } from '../../contexts/FinancialTransactionsContext'

export type CapitalFormData = {
  userId: number
  userGroupId: number
  date: string
  share: boolean
  financialTransactionId: number
  capitalType: number
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
  const { incomeItem, expensesItem } = useFinancialTransactionsContext()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CapitalFormData>({
    defaultValues: {
      capitalType: EXPENSES,
      share: true,
      date: getFullDate(new Date()),
      financialTransactionId: incomeItem?.[0]?.id,
      money: '0',
      note: '',
    },
  })

  const [selectItems, setSelectItems] = React.useState<FinancialTransactions[]>(
    [],
  )

  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (incomeItem && incomeItem.length > 0) {
      setSelectItems(incomeItem)
      setValue('financialTransactionId', incomeItem[0].id)
      setIsLoading(false)
    }
  }, [incomeItem, setValue])

  // watch で監視することで、収支タイプが変更されたら収支項目を変更する
  // watch の戻り値の型が string になるため、後続の評価は == で対応
  const capitalType = watch('capitalType', INCOME)

  React.useEffect(() => {
    // 収支タイプが変更されたら収支項目を変更する
    if (capitalType == INCOME && incomeItem && incomeItem.length > 0) {
      setSelectItems(incomeItem)
      setValue('financialTransactionId', incomeItem[0].id)
      setIsLoading(false)
    } else if (expensesItem && expensesItem.length > 0) {
      setSelectItems(expensesItem)
      setValue('financialTransactionId', expensesItem[0].id)
      setIsLoading(false)
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
    <Paper sx={{ p: 2 }}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
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
                      value={Number(INCOME)}
                      control={<Radio required />}
                      label="収入"
                    />
                    <FormControlLabel
                      value={Number(EXPENSES)}
                      control={<Radio required />}
                      label="支出"
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors?.capitalType?.message}</FormHelperText>
            </FormControl>
          </Box>
          <Box>
            <FormControl
              component="fieldset"
              error={errors?.hasOwnProperty('share')}
            >
              <FormLabel component="legend">共有</FormLabel>
              <Controller
                name="share"
                control={control}
                rules={{
                  validate: (value) =>
                    (value !== null && value !== undefined) ||
                    '共有を選択してください。',
                }}
                render={({ field }): JSX.Element => (
                  <RadioGroup
                    row
                    {...field}
                    onChange={(event) =>
                      field.onChange(event.target.value === 'true')
                    }
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio required />}
                      label="はい"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio required />}
                      label="いいえ"
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors?.share?.message}</FormHelperText>
            </FormControl>
          </Box>
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
                  {!isLoading && (
                    <Select
                      {...field}
                      data-testid="financialTransactionId-input"
                      label="financialTransactionId"
                      labelId="financialTransactionId"
                    >
                      {selectItems.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.label}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  )}
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
                inputProps={{ min: '0', max: '1000000000' }}
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
