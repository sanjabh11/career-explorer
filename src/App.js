   import React, { useState } from 'react';
   import JobTaxonomySelector from './components/JobTaxonomySelector';
   import { generateWBS } from './utils/wbsGenerator';

   function App() {
     const [selectedOccupation, setSelectedOccupation] = useState(null);
     const [wbs, setWBS] = useState(null);

     const handleOccupationSelect = async (occupation) => {
       setSelectedOccupation(occupation);
       try {
         const generatedWBS = await generateWBS(occupation.code);
         setWBS(generatedWBS);
       } catch (error) {
         console.error('Error generating WBS:', error);
       }
     };

     return (
       <div className="App">
         <h1>O*NET Career Explorer</h1>
         <JobTaxonomySelector onSelect={handleOccupationSelect} />
         {selectedOccupation && (
           <div>
             <h2>Selected Occupation: {selectedOccupation.title}</h2>
             {wbs && (
               <div>
                 <h3>Work Breakdown Structure</h3>
                 <h4>Tasks:</h4>
                 <ul>
                   {wbs.tasks.map((task, index) => (
                     <li key={index}>{task.description}</li>
                   ))}
                 </ul>
                 <h4>Skills:</h4>
                 <ul>
                   {wbs.skills.map((skill, index) => (
                     <li key={index}>{skill}</li>
                   ))}
                 </ul>
                 <h4>Technologies:</h4>
                 <ul>
                   {wbs.technologies.map((tech, index) => (
                     <li key={index}>{tech}</li>
                   ))}
                 </ul>
               </div>
             )}
           </div>
         )}
       </div>
     );
   }

   export default App;