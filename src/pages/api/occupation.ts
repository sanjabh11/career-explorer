import { NextApiRequest, NextApiResponse } from 'next'
import { OccupationData } from '@/types/dashboard'
import { processOccupationData } from '@/utils/dataProcessing'

// This is mock data. In a real application, you would fetch this from a database or external API.
const mockOccupationData = {
  title: "Energy Auditors",
  description: "Conduct energy audits of buildings, building systems, or process systems. May also conduct investment grade audits of buildings or systems.",
  code: "47-4011.01",
  overallAPO: 49.51,
  categories: [
    { 
      name: "Tasks", 
      icon: "Briefcase", 
      apo: 46.79,
      details: [
        { name: "Identify and prioritize energy-saving measures", description: "Analyze and rank potential energy-saving initiatives", value: 46.79 },
        { name: "Prepare audit reports", description: "Create comprehensive reports detailing energy analysis results and recommendations", value: 46.79 },
        { name: "Identify health or safety issues", description: "Recognize potential hazards related to weatherization projects", value: 46.79 },
      ]
    },
    { 
      name: "Knowledge", 
      icon: "Book", 
      apo: 50.63,
      details: [
        { name: "Customer and Personal Service", description: "Understanding customer needs and ensuring satisfaction", value: 79 },
        { name: "Building and Construction", description: "Knowledge of materials and methods in construction", value: 75 },
        { name: "Mathematics", description: "Application of arithmetic, algebra, geometry, and statistics", value: 75 },
      ]
    },
    { 
      name: "Skills", 
      icon: "Brain", 
      apo: 46.14,
      details: [
        { name: "Reading Comprehension", description: "Understanding written information in work documents", value: 72 },
        { name: "Speaking", description: "Conveying information effectively through speech", value: 72 },
        { name: "Active Listening", description: "Giving full attention to speakers, asking questions as appropriate", value: 69 },
      ]
    },
    { 
      name: "Abilities", 
      icon: "BarChart2", 
      apo: 48.33,
      details: [
        { name: "Oral Comprehension", description: "The ability to listen and understand information and ideas presented through spoken words and sentences", value: 75 },
        { name: "Oral Expression", description: "The ability to communicate information and ideas in speaking so others will understand", value: 75 },
        { name: "Written Comprehension", description: "The ability to read and understand information and ideas presented in writing", value: 75 },
      ]
    },
    { 
      name: "Technologies", 
      icon: "Cpu", 
      apo: 55.65,
      details: [
        { name: "Ekotrope RATER", description: "Analytical or scientific software", value: 57.5 },
        { name: "IBM SPSS Statistics", description: "Analytical or scientific software", value: 57.5 },
        { name: "SAS", description: "Analytical or scientific software", value: 57.5 },
      ]
    }
  ]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OccupationData>
) {
  if (req.method === 'GET') {
    // Process the mock data
    const processedData = processOccupationData(mockOccupationData)
    res.status(200).json(processedData)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}