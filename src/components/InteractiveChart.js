import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const InteractiveChart = ({ data }) => {
  const chartData = [
    { name: 'Tasks', APO: data.tasks ? getAverageAPO(data.tasks, 'tasks') : 0 },
    { name: 'Knowledge', APO: data.knowledge ? getAverageAPO(data.knowledge, 'knowledge') : 0 },
    { name: 'Skills', APO: data.skills ? getAverageAPO(data.skills, 'skills') : 0 },
    { name: 'Abilities', APO: data.abilities ? getAverageAPO(data.abilities, 'abilities') : 0 },
    { name: 'Technologies', APO: data.technologies ? getAverageAPO(data.technologies, 'technologies') : 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="APO" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};