import { fireEvent, render, waitFor } from '@testing-library/react'
import UserEditForm from './index'

describe('UserEditForm', () => {
  const onUserSave = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const testUser = {
    id: 1,
    groupId: 1,
    authType: 1,
    name: 'test',
    password: 'password',
    password_confirmation: 'password',
    email: 'example@example.com',
    profileImage: '',
    delete: 'false',
  }

  it('UserEditFormのレンダリング', () => {
    const { getByLabelText, getByText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    expect(getByLabelText('ユーザ名')).toBeInTheDocument()
    expect(getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(getByLabelText('パスワード')).toBeInTheDocument()
    expect(getByLabelText('パスワード確認')).toBeInTheDocument()
    expect(getByText('更新する')).toBeInTheDocument()
  })

  it('テストデータを使用してフォームの送信すると onUserSaveが呼ばれる', async () => {
    const { getByLabelText, getByText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), {
      target: { value: 'test' },
    })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: 'example@example.com' },
    })
    fireEvent.change(getByLabelText('パスワード'), {
      target: { value: 'password' },
    })
    fireEvent.change(getByLabelText('パスワード確認'), {
      target: { value: 'password' },
    })

    fireEvent.click(getByText('更新する'))

    // onUserSaveが1回呼ばれること
    await waitFor(() => {
      expect(onUserSave).toHaveBeenCalledTimes(1)
    })
  })

  it('空の必須フィールドエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), { target: { value: '' } })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: '' },
    })
    fireEvent.click(getByText('更新する'))

    await waitFor(() => {
      expect(getByText('ユーザ名を入力してください。')).toBeInTheDocument()
      expect(
        getByText('メールアドレスを入力してください。'),
      ).toBeInTheDocument()
    })
  })

  it('パスワードが8文字未満の場合はエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), {
      target: { value: 'test' },
    })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: 'example@example.com' },
    })
    fireEvent.change(getByLabelText('パスワード'), {
      target: { value: 'test' },
    })
    fireEvent.change(getByLabelText('パスワード確認'), {
      target: { value: 'test' },
    })
    fireEvent.click(getByText('更新する'))

    await waitFor(() => {
      expect(
        getByText('パスワードは8文字以上で入力してください。'),
      ).toBeInTheDocument()
    })
  })

  it('パスワードとパスワード確認が一致しない場合はエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), {
      target: { value: 'test' },
    })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: 'example@example.com' },
    })
    fireEvent.change(getByLabelText('パスワード'), {
      target: { value: 'password' },
    })
    fireEvent.change(getByLabelText('パスワード確認'), {
      target: { value: 'password2' },
    })
    fireEvent.click(getByText('更新する'))

    await waitFor(() => {
      expect(
        getByText('パスワードとパスワード確認が一致しません。'),
      ).toBeInTheDocument()
    })
  })

  it('メールアドレスの形式が不正な場合はエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), {
      target: { value: 'test' },
    })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: 'example' },
    })
    fireEvent.change(getByLabelText('パスワード'), {
      target: { value: 'password' },
    })
    fireEvent.change(getByLabelText('パスワード確認'), {
      target: { value: 'password' },
    })
    fireEvent.click(getByText('更新する'))

    await waitFor(() => {
      expect(getByText(/メールアドレスの形式が不正です。/i)).toBeInTheDocument()
    })
  })

  it('ユーザ名が15文字以上の場合はエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), {
      target: { value: 'testtesttesttest' },
    })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: 'example@example.com' },
    })
    fireEvent.change(getByLabelText('パスワード'), {
      target: { value: 'password' },
    })
    fireEvent.change(getByLabelText('パスワード確認'), {
      target: { value: 'password' },
    })
    fireEvent.click(getByText('更新する'))

    await waitFor(() => {
      expect(
        getByText('ユーザ名は15文字以下で入力してください。'),
      ).toBeInTheDocument()
    })
  })

  it('ユーザー名が2文字未満の場合はエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <UserEditForm onUserSave={onUserSave} user={testUser} />,
    )

    fireEvent.change(getByLabelText('ユーザ名'), {
      target: { value: 't' },
    })
    fireEvent.change(getByLabelText('メールアドレス'), {
      target: { value: 'example@example.com' },
    })
    fireEvent.change(getByLabelText('パスワード'), {
      target: { value: 'password' },
    })
    fireEvent.change(getByLabelText('パスワード確認'), {
      target: { value: 'password' },
    })
    fireEvent.click(getByText('更新する'))
    await waitFor(() => {
      expect(
        getByText('ユーザ名は2文字以上で入力してください。'),
      ).toBeInTheDocument()
    })
  })
})
