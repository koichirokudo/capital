import { fireEvent, render, waitFor } from '@testing-library/react'
import LoginForm from './index'

describe('LoginForm', () => {
  const handleLogin = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('LoginFormのレンダリング', () => {
    const { getByLabelText, getByText } = render(
      <LoginForm handleLogin={handleLogin} />,
    )

    expect(getByLabelText(/ユーザ名/i)).toBeInTheDocument()
    expect(getByLabelText(/パスワード/i)).toBeInTheDocument()
    expect(getByText(/ログイン/i)).toBeInTheDocument()
  })

  it('テストデータを使用してフォームの送信すると handleLoginが呼ばれる', async () => {
    const { getByLabelText, getByText } = render(
      <LoginForm handleLogin={handleLogin} />,
    )

    fireEvent.change(getByLabelText(/ユーザ名/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(getByLabelText(/パスワード/i), {
      target: { value: 'testpassword' },
    })
    fireEvent.click(getByText(/ログイン/i))

    // handleLoginが1回呼ばれること
    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledTimes(1)
    })
  })

  it('空の必須フィールドエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <LoginForm handleLogin={handleLogin} />,
    )

    fireEvent.change(getByLabelText(/ユーザ名/i), { target: { value: '' } })
    fireEvent.change(getByLabelText(/パスワード/i), { target: { value: '' } })
    fireEvent.click(getByText(/ログイン/i))

    await waitFor(() => {
      expect(getByText(/ユーザ名を入力してください。/i)).toBeInTheDocument()
      expect(getByText(/パスワードを入力してください。/i)).toBeInTheDocument()
    })
  })

  it('パスワードが8文字未満の場合はエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <LoginForm handleLogin={handleLogin} />,
    )

    fireEvent.change(getByLabelText(/ユーザ名/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(getByLabelText(/パスワード/i), {
      target: { value: 'test' },
    })
    fireEvent.click(getByText(/ログイン/i))

    await waitFor(() => {
      expect(getByText(/パスワードは8文字以上で入力してください。/i)).toBeInTheDocument()
    })
  })
})
