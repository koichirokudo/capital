import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { eachYearOfInterval } from 'date-fns'
import { MONTH_LIST, YEAR_LIMIT } from 'const'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'

type MonthControlProps = {
  year: number
  month: number
}

const MonthControl = ({ year, month }: MonthControlProps) => {
  const router = useRouter()
  const setSpinner = useSpinnerActionsContext()
  const [selectedYear, setSelectedYear] = React.useState<string>(
    year.toString(),
  )
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    month.toString(),
  )
  const YearList = React.useMemo(() => {
    return eachYearOfInterval({
      start: new Date(YEAR_LIMIT, 1, 1),
      end: new Date(),
    })
  }, [])

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value)
  }

  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSpinner(true)
    setTimeout(() => {
      setSpinner(false)
    }, 500)
    router.push(`/report/month?year=${selectedYear}&month=${selectedMonth}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <FormControl>
          <InputLabel id="select-year-label">年</InputLabel>
          <Select
            required
            labelId="select-year-label"
            id="select-year"
            value={selectedYear}
            label="年"
            sx={{ width: '150px', mr: 1 }}
            color="primary"
            onChange={handleYearChange}
          >
            {YearList.map((date, index) => (
              <MenuItem key={index} value={date.getFullYear().toString()}>
                {date.getFullYear().toString()}年
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="select-month-label">月</InputLabel>
          <Select
            required
            labelId="select-month-label"
            id="select-month"
            value={selectedMonth}
            label="月"
            sx={{ width: '100px', mr: 1 }}
            onChange={handleMonthChange}
          >
            {MONTH_LIST.map((month, index) => (
              <MenuItem key={index} value={month}>
                {month}月
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="outlined" color="primary">
          選択
        </Button>
      </Box>
    </form>
  )
}

export default MonthControl
