import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import Template from 'components/Templates'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Template>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image
            src="/logo.png"
            width={350}
            height={100}
            alt="MyCapi"
            priority={true}
          />
          <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
            共有家計簿アプリ
          </Typography>
          <Typography variant="body1">
            MyCapiは、シンプルな共有家計簿アプリケーションです。ユーザーは自分の支出と収入を登録し、その情報を共有することができます。
            <br />
            また、各ユーザーの支払い合計を計算し、他のユーザーに対する支払いを自動的に計算する機能もあります。
            <br />
            これにより、ユーザーは他のユーザーにどれだけ支払うべきかを簡単に把握することができます。
            <br />
            <br />
            さらに、MyCapiは年間と月間のレポートを提供します。ユーザーは自分の支出と収入の傾向を視覚的に理解することができます。
            <br />
            ユーザーが自分の財政状況を管理し、必要に応じて調整するのに役立ちます。
            <br />
            MyCapiは、家族や友人との共有家計簿を管理するための便利なツールです。
            <br />
            ぜひ、MyCapiをお試しください！
          </Typography>
        </Box>
      </Template>
    </>
  )
}

export default Home
