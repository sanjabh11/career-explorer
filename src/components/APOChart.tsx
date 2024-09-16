   // src/components/APOChart.tsx

   import React from 'react';
   import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

   interface APOChartProps {
     data: { category: string; apo: number }[];
   }

   const APOChart: React.FC<APOChartProps> = ({ data }) => {
     return (
       <ResponsiveContainer width="100%" height={300}>
         <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis type="number" domain={[0, 100]} />
           <YAxis dataKey="category" type="category" width={100} />
           <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
           <Bar dataKey="apo" fill="#add8e6" label={{ position: 'right', formatter: (value: number) => `${value.toFixed(2)}%` }}>
             {data.map((entry, index) => (
               <Cell key={`cell-${index}`} />
             ))}
           </Bar>
         </BarChart>
       </ResponsiveContainer>
     );
   };

   export default APOChart;