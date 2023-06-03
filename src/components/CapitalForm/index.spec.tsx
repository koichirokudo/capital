import { findByText, fireEvent, render, waitFor } from '@testing-library/react'
import CapitalForm from './index'

describe('CapitalForm', () => {
  const onCapitalSave = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('CapitalFormのレンダリング', () => {
    const { getByLabelText, getByText } = render(
      <CapitalForm onCapitalSave={onCapitalSave} />,
    )

    expect(getByText(/収支タイプ/i)).toBeInTheDocument()
    expect(getByLabelText(/日時/i)).toBeInTheDocument()
    expect(getByLabelText(/収支項目/i)).toBeInTheDocument()
    expect(getByLabelText(/金額/i)).toBeInTheDocument()
    expect(getByLabelText(/メモ/i)).toBeInTheDocument()
    expect(getByText(/登録/i)).toBeInTheDocument()
  })

  it('テストデータを使用してフォームの送信すると onCapitalSaveが呼ばれる', async () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <CapitalForm onCapitalSave={onCapitalSave} />,
    )

    fireEvent.click(getByText(/収支タイプ/i))
    fireEvent.change(getByLabelText(/日時/i), {
      target: { value: '2023/02/02' },
    })

    const itemSelect = getByTestId('expensesItem-input')
    fireEvent.mouseDown(itemSelect)

    // FIXME: うまくいかん！
    // const itemElement = await findByText('食費');
    // fireEvent.click(itemElement)
    // debug(baseElement)

    fireEvent.change(getByLabelText(/金額/i), { target: { value: '5000' } })
    fireEvent.change(getByLabelText(/メモ/i), {
      target: { value: 'テストメモ' },
    })

    fireEvent.click(getByText(/登録/i))

    // onCapitalSaveが1回呼ばれること
    await waitFor(() => {
      expect(onCapitalSave).toHaveBeenCalledTimes(1)
    })
  })

  it('空の必須フィールドエラーメッセージを表示する', async () => {
    const { getByText, getByLabelText } = render(
      <CapitalForm onCapitalSave={onCapitalSave} />,
    )

    fireEvent.change(getByLabelText('日時'), { target: { value: '' } })
    fireEvent.change(getByLabelText('金額'), { target: { value: '' } })
    fireEvent.click(getByText(/登録/i))

    await waitFor(() => {
      expect(getByText(/日時を選択してください。/i)).toBeInTheDocument()
      expect(getByText(/金額を入力してください。/i)).toBeInTheDocument()
    })
  })
})
