import type { NextPage } from 'next'
import Header from 'components/Header'
import { Typography } from '@mui/material'

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Typography>Hello, Next.js and MUI</Typography>
    </>
  )
}

export default Home
