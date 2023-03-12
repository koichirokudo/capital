import { Box, IconButton, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import Link from 'next/link'
import { formatDate } from 'utils/format'

type YearControlProps = {
  year: number
}

const PREV_YEAR_LIMIT = 2020

const YearControl = ({ year }: YearControlProps) => {
  const prevYear = year - 1
  const nextYear = year + 1
  const nextLimit = nextYear <= Number(formatDate(new Date(), 'year'))
  const prevLimit = prevYear >= PREV_YEAR_LIMIT
  return (
    <Box sx={{ display: 'flex' }}>
      {prevLimit && (
        <Link href={`/report?year=${prevYear}`} passHref>
          <IconButton color="primary" aria-label="back button" component="a">
            <ChevronLeft />
          </IconButton>
        </Link>
      )}
      <Typography variant="h5" sx={{ mb: 2 }}>
        {year}年
      </Typography>
      {nextLimit && (
        <Link href={`/report?year=${nextYear}`} passHref>
          <IconButton color="primary" aria-label="next button" component="a">
            <ChevronRight />
          </IconButton>
        </Link>
      )}
    </Box>
  )
}

export default YearControl
