import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ResizeObserver from 'resize-observer-polyfill'
import { Chart, registerables } from 'chart.js'
import LineChart from './index'

global.ResizeObserver = ResizeObserver
Chart.register(...registerables)

const testData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Test Dataset',
      data: [10, 20, 30, 40, 50],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
}

const testOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

describe('LineChart', () => {
  it('LineChartが正しくレンダリングできること', () => {
    render(
      <LineChart
        data={testData}
        options={testOptions}
        height={400}
        width={600}
      />,
    )
  })

  it('canvasがレンダリングできること', () => {
    render(
      <LineChart
        data={testData}
        options={testOptions}
        height={400}
        width={600}
      />,
    )
    const canvasElement = screen.getByRole('img')
    expect(canvasElement).toBeInTheDocument()
  })
})
