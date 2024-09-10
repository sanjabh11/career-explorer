import React from 'react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, ChartOptions, ChartType } from 'chart.js';
import { OccupationDetails } from '@/types/onet';

ChartJS.register(...registerables);

interface AutomationPotentialChartProps {
  occupationData: OccupationDetails;
  chartType: 'bar' | 'pie' | 'radar';
}

const AutomationPotentialChart: React.FC<AutomationPotentialChartProps> = ({ occupationData, chartType }) => {
  const categories = occupationData.categories || [];
  const data = {
    labels: categories.map(category => category.name),
    datasets: [
      {
        label: 'APO',
        data: categories.map(category => category.apo * 100),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const baseOptions: ChartOptions<ChartType> = {
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

  switch (chartType) {
    case 'pie':
      return <Pie data={data} options={baseOptions as ChartOptions<'pie'>} />;
    case 'radar':
      return <Radar data={data} options={baseOptions as ChartOptions<'radar'>} />;
    default:
      return <Bar data={data} options={baseOptions as ChartOptions<'bar'>} />;
  }
};

export default AutomationPotentialChart;