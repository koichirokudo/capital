import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import {YEAR_LIMIT} from 'const'
import React from 'react'
import {eachYearOfInterval} from 'date-fns'
import {useSpinnerActionsContext} from 'contexts/SpinnerContext'

type YearControlProps = {
  year: number
  setYear: React.Dispatch<React.SetStateAction<number>>
}

const YearControl = ({year, setYear}: YearControlProps) => {
  const setSpinner: React.Dispatch<React.SetStateAction<boolean>> = useSpinnerActionsContext()

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSpinner(true)
    setYear(parseInt(selectedYear))
    setTimeout(() => {
      setSpinner(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{display: 'flex', mb: 2}}>
        <FormControl>
          <InputLabel id="select-year-label">年</InputLabel>
          <Select
            required
            labelId="select-year-label"
            id="select-year"
            value={selectedYear}
            label="年"
            sx={{width: '150px', mr: 1}}
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
