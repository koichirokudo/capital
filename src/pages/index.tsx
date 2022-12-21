import type { NextPage } from 'next'
import Template from 'components/Template'
import { Typography } from '@mui/material'

const Home: NextPage = () => {
  return (
    <>
      <Template title="ダッシュボード">
        <Typography variant='h3'>Hello, Next.js</Typography>
      </Template>
    </>
  )
}

export default Home
