import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  LinearScale,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  Filler,
} from 'chart.js'
import React from 'react'
import { Line } from 'react-chartjs-2'

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
  data: ChartData<'line', number[], string>
  options?: ChartOptions
  height: number
  width: number
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  options,
  height,
  width,
}) => {

  return <Line data={data} options={options} height={height} width={width} />
}

export default LineChart
