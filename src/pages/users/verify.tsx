import { NextPage } from 'next'
import Template from '../../components/Templates'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import verifyUser from '../../services/users/verify-user'
import Link from 'next/link'

const VerifyPage: NextPage = () => {
  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    const verifyToken = async (token: { token: string }) => {
      try {
        const res = await verifyUser(token)
        if (res.status === 'error') {
          router.push('/invalid')
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (token) {
      verifyToken({ token: token as string })
    }
  }, [token, router])

  return (
    <>
      <Template>
        <div>
          <h2>ユーザー本登録</h2>
          <p>本登録が完了しました。</p>
          <p>ログインしてご利用ください。</p>
          <Link href="/login">
            <a>ログイン画面へ</a>
          </Link>
        </div>
      </Template>
    </>
  )
}

export default VerifyPage
