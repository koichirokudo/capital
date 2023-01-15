import React from 'react'
import {
  BarController,
  BarElement,
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels'
import { Context } from 'chartjs-plugin-datalabels'
import ChartDataLabels from 'chartjs-plugin-datalabels'

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
  data: any
  options?: {}
  height?: number
  width?: number
}

interface BarContext extends Context {
  bar?: number
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  options = {},
  height,
  width,
}) => {
  return <Bar data={data} options={options} height={height} width={width} />
}

export default BarChart
