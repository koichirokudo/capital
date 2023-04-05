import { render, screen, within, fireEvent } from '@testing-library/react'
import React from 'react'
import CapitalList from './index'

const mockCapitals = [
  {
    id: 1,
    date: '2023-03-25',
    userName: 'Alice',
    capitalType: '収入',
    category: '給料',
    money: 3000,
    note: 'Salary',
  },
  {
    id: 2,
    date: '2023-03-26',
    userName: 'Bob',
    capitalType: '支出',
    category: '食費',
    money: 1000,
    note: 'Groceries',
  },
]

const mockMutate = jest.fn()

describe('CapitalList', () => {
  beforeEach(() => {
    render(<CapitalList capitals={mockCapitals} mutate={mockMutate} />)
  })

  it('CapiltalListがレンダリングできること', () => {
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })
})
