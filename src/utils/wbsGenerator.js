   import { getOccupationDetails } from '../services/OnetService';

   export const generateWBS = async (occupationCode) => {
     try {
       const occupationData = await getOccupationDetails(occupationCode);
       
       const wbs = {
         occupation: occupationData.details.title,
         tasks: occupationData.tasks.map(task => ({
           description: task.description,
           automationPotential: null // To be filled manually later
         })),
         skills: occupationData.skills.map(skill => skill.name),
         technologies: occupationData.technologies.map(tech => tech.example)
       };

       return wbs;
     } catch (error) {
       console.error('Error generating WBS:', error);
       throw error;
     }
   };