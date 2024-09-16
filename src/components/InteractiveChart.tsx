// src/components/InteractiveChart.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OccupationDetails } from '@/types/onet';
import { getAverageAPO } from '@/utils/apoCalculations';

interface InteractiveChartProps {
  data: OccupationDetails;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Tasks', APO: getAverageAPO(data.tasks, 'tasks') },
    { name: 'Knowledge', APO: getAverageAPO(data.knowledge, 'knowledge') },
    { name: 'Skills', APO: getAverageAPO(data.skills, 'skills') },
    { name: 'Abilities', APO: getAverageAPO(data.abilities, 'abilities') },
    { name: 'Technologies', APO: getAverageAPO(data.technologies, 'technologies') },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="APO" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};