import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { YEAR_LIMIT } from 'const'
import React from 'react'
import { eachYearOfInterval } from 'date-fns'
import { useRouter } from 'next/router'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'

type YearControlProps = {
  year: number
}

const YearControl = ({ year }: YearControlProps) => {
  const router = useRouter()
  const setSpinner = useSpinnerActionsContext()

  const [selectedYear, setSelectedYear] = React.useState<string>(
    year.toString(),
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSpinner(true)
    setTimeout(() => {
      setSpinner(false)
    }, 500)
    router.push(`/report/year?year=${selectedYear}`)
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
        <Button type="submit" variant="outlined" color="primary">
          選択
        </Button>
      </Box>
    </form>
  )
}

export default YearControl
