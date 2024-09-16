// src/components/APOChart.tsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface APOChartProps {
  data: {
    category: string;
    apo: number;
  }[];
}

const APOChart: React.FC<APOChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'APO (%)',
        data: data.map(item => item.apo),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Automation Potential by Category',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default APOChart;