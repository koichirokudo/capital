import React from 'react'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { labels } from 'const'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  BarElement,
  BarController,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
)

interface LineChartProps {
  data: any
  height: number
  width: number
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height,
  width,
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        fill: 'start',
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      y: {
        suggestedMin: 50,
        suggestedMax: 100,
      },
    },
  }

  data.labels = labels

  return <Line data={data} options={options} height={height} width={width} />
}

export default LineChart
