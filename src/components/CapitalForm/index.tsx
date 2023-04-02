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
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Categories } from 'components/CategoryList'
import { ja } from 'date-fns/locale'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { getFullDate } from 'utils/format'

export type CapitalFormData = {
  userId: number
  groupId: number
  date: string
  share: string
  category: string
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
  const today = getFullDate(new Date())
  const categories = Categories

  const onSubmit = (data: CapitalFormData) => {
    onCapitalSave && onCapitalSave(data)
  }

  const [capitalType, setCapitalType] = React.useState('0')
  const [category, setCategory] = React.useState('undefined')

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CapitalFormData>()

  const handleCapitalType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapitalType(event.target.value)
  }

  const handleSelectCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string)
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl required error={errors?.hasOwnProperty('capitalType')}>
            <FormLabel id="capital-type-radio">収支タイプ</FormLabel>
            <RadioGroup
              row
              id="capital-type-radio"
              aria-labelledby="capital-type-radio"
              name="capitalType"
              defaultValue="income"
              value={capitalType}
              onChange={handleCapitalType}
            >
              <FormControlLabel
                value="income"
                control={<Radio />}
                label="収入"
              />
              <FormControlLabel
                value="expenses"
                control={<Radio />}
                label="支出"
              />
            </RadioGroup>
            <FormHelperText>{errors?.capitalType?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth error={errors?.hasOwnProperty('date')}>
            <Controller
              name="date"
              control={control}
              rules={{ required: '日時を選択してください。' }}
              defaultValue={today}
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
              name="category"
              defaultValue="undefined"
              control={control}
              rules={{ required: 'カテゴリを選択してください。' }}
              render={({ field }): JSX.Element => (
                <>
                  <InputLabel id="category">カテゴリ</InputLabel>
                  <Select
                    {...field}
                    data-testid="category-input"
                    label="category"
                    labelId="category"
                    defaultValue="undefined"
                    onChange={handleSelectCategory}
                    value={category}
                  >
                    {categories.map((c, index) => {
                      return (
                        <MenuItem key={index} value={c.value}>
                          {c.label}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{errors?.category?.message}</FormHelperText>
                </>
              )}
            />
          </FormControl>
          <Controller
            name="money"
            control={control}
            defaultValue={0}
            rules={{ required: '金額を入力してください。' }}
            render={({ field }): JSX.Element => (
              <TextField
                {...field}
                fullWidth
                inputProps={{ min: '0' }}
                autoComplete="off"
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
            defaultValue={'undefined'}
            render={({ field }): JSX.Element => (
              <TextField
                {...field}
                autoComplete="off"
                margin="normal"
                type="text"
                label="メモ"
                fullWidth
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
