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
import { labels } from 'const'
import 'chartjs-plugin-datalabels'
import { Context } from 'chartjs-plugin-datalabels'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { formatMoney } from 'utils/format'

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
  height?: number
  width?: number
}

interface BarContext extends Context {
  bar?: number
}

export const BarChart: React.FC<BarChartProps> = ({ data, height, width }) => {
  data.labels = labels

  return (
    <Bar
      data={data}
      options={{
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
              },
            },
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            display: true,
            font: {
              size: 10,
              weight: 'bold',
            },
            anchor: 'end',
            align: 'end',
            formatter: function (value, context) {
              return formatMoney(value.toString())
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 20,
              },
            },
          },
          y: {
            display: true,
            grid: {
              display: false,
            },
          },
        },
      }}
      height={height}
      width={width}
    />
  )
}

export default BarChart
