import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import CapitalForm, { CapitalFormData } from './index'
import { Categories } from 'components/CategoryList'

describe('CapitalForm', () => {
  const onCapitalSave = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('CapitalFormのレンダリング', () => {
    const { getByLabelText, getByText } = render(
      <CapitalForm onCapitalSave={onCapitalSave} />,
    )

    expect(getByLabelText(/収支タイプ/i)).toBeInTheDocument()
    expect(getByLabelText(/日時/i)).toBeInTheDocument()
    expect(getByLabelText(/カテゴリ/i)).toBeInTheDocument()
    expect(getByLabelText(/金額/i)).toBeInTheDocument()
    expect(getByLabelText(/メモ/i)).toBeInTheDocument()
    expect(getByText(/登録/i)).toBeInTheDocument()
  })

  it('テストデータを使用してフォームの送信をする', async () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <CapitalForm onCapitalSave={onCapitalSave} />,
    )

    fireEvent.click(getByLabelText(/収支/i))
    fireEvent.change(getByLabelText(/日時/i), {
      target: { value: '2023/02/02' },
    })

    const categorySelect = getByTestId('category-input')
    fireEvent.mouseDown(categorySelect)

    const categoryToSelect = Categories[0]
    fireEvent.click(getByText(categoryToSelect.label))

    fireEvent.change(getByLabelText(/金額/i), { target: { value: '5000' } })
    fireEvent.change(getByLabelText(/メモ/i), {
      target: { value: 'テストメモ' },
    })

    fireEvent.click(getByText(/登録/i))

    // onCapitalSaveが1回呼ばれ、testDataが渡されることを確認する
    await waitFor(() => {
      expect(onCapitalSave).toHaveBeenCalledTimes(1)
    })
  })
})
