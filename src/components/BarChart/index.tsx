import {
  BarController,
  BarElement,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import React from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend,
)

interface BarChartProps {
  data: ChartData<'bar'>
  options?: ChartOptions
  height?: number
  width?: number
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  options = {},
  width,
  height,
}) => {
  return <Bar data={data} options={options} width={width} height={height} />
}

export default BarChart
