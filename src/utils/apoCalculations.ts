// src/utils/apoCalculations.ts

const APO_CATEGORIES = {
    tasks: {
      "Analyzing Data": 65, "Preparing Reports": 55, "Coordinating Activities": 40,
      "Evaluating Information": 35, "Developing Objectives": 25, "Communicating": 30,
      "Monitoring Processes": 50, "Training": 35, "Problem Solving": 45,
      "Updating Knowledge": 60, "Programming": 65, "Debugging": 55, "Testing": 50, "Documenting": 45
    },
    knowledge: {
      "Administration and Management": 35, "Customer and Personal Service": 40,
      "Engineering and Technology": 50, "Mathematics": 70, "English Language": 55,
      "Computers and Electronics": 60, "Education and Training": 40, "Psychology": 30,
      "Law and Government": 45, "Production and Processing": 55, "Design": 45, "Geography": 40
    },
    skills: {
      "Active Listening": 35, "Critical Thinking": 40, "Reading Comprehension": 60,
      "Speaking": 25, "Writing": 55, "Active Learning": 50, "Monitoring": 65,
      "Social Perceptiveness": 20, "Time Management": 45, "Complex Problem Solving": 40,
      "Programming": 65, "Systems Analysis": 55, "Quality Control Analysis": 50,
      "Judgment and Decision Making": 45
    },
    abilities: {
      "Oral Comprehension": 40, "Written Comprehension": 65, "Oral Expression": 25,
      "Written Expression": 55, "Fluency of Ideas": 35, "Originality": 30,
      "Problem Sensitivity": 55, "Deductive Reasoning": 50, "Inductive Reasoning": 60,
      "Information Ordering": 70, "Near Vision": 40, "Speech Recognition": 35
    },
    technologies: {
      "Development Environment": 55, "Presentation Software": 50,
      "Object Oriented Development": 60, "Web Platform Development": 65,
      "Database Management": 70, "Operating System": 45,
      "Data Base User Interface": 55, "Compiler and Decompiler": 50,
      "Enterprise Resource Planning": 60, "Enterprise Application Integration": 65
    }
  };
  
  export const calculateAPO = (item: any, category: string): number => {
    const categoryAPOs = APO_CATEGORIES[category as keyof typeof APO_CATEGORIES];
    if (!categoryAPOs) return 0;
  
    const itemName = item.name || item.title || '';
    const itemDescription = item.description || '';
    const fullText = `${itemName} ${itemDescription}`.toLowerCase();
  
    for (const [key, value] of Object.entries(categoryAPOs)) {
      if (fullText.includes(key.toLowerCase())) {
        return value;
      }
    }
  
    return Object.values(categoryAPOs).reduce((a, b) => a + b, 0) / Object.values(categoryAPOs).length;
  };
  
  export const getAverageAPO = (items: any[] | undefined, category: string): number => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log(`No valid items found for category: ${category}`);
      return 0;
    }
    const totalAPO = items.reduce((sum, item) => {
      const itemAPO = calculateAPO(item, category);
      console.log(`Item: "${item.name || item.title}", APO: ${itemAPO}`);
      return sum + itemAPO;
    }, 0);
    const averageAPO = totalAPO / items.length;
    console.log(`Average APO for ${category}: ${averageAPO.toFixed(2)}%`);
    return averageAPO;
  };