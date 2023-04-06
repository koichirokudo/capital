import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ResizeObserver from 'resize-observer-polyfill'
import { Chart, registerables } from 'chart.js'
import { BarChart } from '.'

global.ResizeObserver = ResizeObserver
Chart.register(...registerables)

const mockData = {
  labels: ['給料', '賞与', '副業', '小遣い', '投資', '臨時'],
  datasets: [
    {
      label: 'カテゴリ',
      data: [1000, 2000, 3000, 4000, 5000, 6000],
      backgroundColor: 'rgba(0, 171, 85, 0.9)',
      barPercentage: 0.9,
      borderWidth: 10,
      skipNull: true,
    },
  ],
}

describe('BarChart', () => {
  it('BarChartが正しくレンダリングできること', () => {
    render(<BarChart data={mockData} />)
  })

  it('canvasがレンダリングできること', () => {
    render(<BarChart data={mockData} />)
    const canvasElement = screen.getByRole('img')
    expect(canvasElement).toBeInTheDocument()
  })
})
