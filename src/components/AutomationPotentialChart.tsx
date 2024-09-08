import React from 'react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, ChartOptions } from 'chart.js';
import { OccupationDetails } from '@/types/onet';

ChartJS.register(...registerables);

interface AutomationPotentialChartProps {
  occupationData: OccupationDetails;
  chartType: 'bar' | 'pie' | 'radar';
}

const AutomationPotentialChart: React.FC<AutomationPotentialChartProps> = ({ occupationData, chartType }) => {
  const data = {
    labels: occupationData.categories.map(category => category.name),
    datasets: [
      {
        label: 'APO',
        data: occupationData.categories.map(category => category.apo * 100),
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

  const baseOptions: ChartOptions<'bar' | 'pie' | 'radar'> = {
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
    onClick: (event, elements) => {
      if (elements.length === 0) return;
      const index = elements[0].index;
      const category = occupationData.categories[index];
      console.log('Clicked category:', category);
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