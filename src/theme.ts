import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  // theme
  palette: {
    primary: {
      main: '#ffa500',
    },
    secondary: {
      main: '#ffb6c1',
    },
  },
  typography: {
    fontFamily: ['Kosugi Maru', 'Yu Gothic', 'Roboto', 'sans-serif'].join(','),
    fontSize: 14,
  },
})

export default theme
