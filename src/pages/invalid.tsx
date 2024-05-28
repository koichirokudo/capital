import { NextPage } from 'next'
import Template from '../components/Templates'

const invalidPage: NextPage = () => {
  return (
    <Template>
      <div>
        <h1>無効なページ</h1>
        <p>無効なページです。URLを確認してください。</p>
      </div>
    </Template>
  )
}

export default invalidPage
