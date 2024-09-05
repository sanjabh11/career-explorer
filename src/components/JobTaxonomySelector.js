import React, { useState, useEffect } from 'react';
import { searchOccupations, getOccupationDetails } from '../services/OnetService';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownNavigation } from './DropdownNavigation';
import { SearchAutocomplete } from './SearchAutocomplete';
import { InteractiveChart } from './InteractiveChart';

const apoCategoriesPercentages = {
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

const calculateAPO = (item, category) => {
  if (!item || (!item.name && !item.title && !item.description)) {
    console.log(`Invalid item in category: ${category}`);
    return 0;
  }

  const itemName = item.name || item.title || '';
  const itemDescription = typeof item.description === 'string' ? item.description : '';
  const fullText = `${itemName} ${itemDescription}`.toLowerCase();

  console.log(`Calculating APO for item: "${itemName}" in category: "${category}"`);
  console.log(`Full text: "${fullText}"`);

  for (const [key, value] of Object.entries(apoCategoriesPercentages[category])) {
    if (fullText.includes(key.toLowerCase())) {
      console.log(`Matched "${key}" in category "${category}" with APO ${value}%`);
      return value;
    }
  }

  const averageCategoryAPO = Object.values(apoCategoriesPercentages[category]).reduce((a, b) => a + b, 0) / Object.values(apoCategoriesPercentages[category]).length;
  console.log(`No exact match found for "${itemName}" in category "${category}". Using average category APO: ${averageCategoryAPO.toFixed(2)}%`);
  return averageCategoryAPO;
};

const getAverageAPO = (items, category) => {
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

const JobTaxonomySelector = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customAPOData, setCustomAPOData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const occupations = await searchOccupations(searchTerm);
      setResults(occupations);
    } catch (error) {
      console.error('Error searching occupations:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOccupationSelect = async (occupation) => {
    console.log('Selected occupation:', occupation);
    setIsLoading(true);
    setError(null);
    try {
      const details = await getOccupationDetails(occupation.code);
      console.log('Processed occupation details:', details);
      setSelectedOccupation({ ...occupation, ...details });
    } catch (error) {
      console.error('Error fetching occupation details:', error);
      setError('An error occurred while fetching occupation details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setCustomAPOData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const renderList = (title, items, category) => {
    if (!items || items.length === 0) {
      return (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-600">No {title.toLowerCase()} information is currently available for this occupation.</p>
        </div>
      );
    }
    const averageAPO = getAverageAPO(items, category);
    return (
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">Average APO: {averageAPO.toFixed(2)}%</p>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-md">
              <div className="font-semibold">{item.name || 'Unnamed Item'}</div>
              <div className="text-sm text-gray-700">
                {item.description && (
                  <p>{item.description}</p>
                )}
                {item.value && (
                  <p>
                    Value: {item.value}, 
                    Scale: {item.scale}
                  </p>
                )}
                {category === 'technologies' && (
                  <>
                    <p>Commodity Code: {item.commodityCode || 'N/A'}</p>
                    <p>Hot Technology: {item.hotTechnology ? 'Yes' : 'No'}</p>
                  </>
                )}
                <p>APO: {calculateAPO(item, category).toFixed(2)}%</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderAdditionalDetails = (details) => {
    return (
      <div className="mb-4 bg-gray-100 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
        <p className="mb-2"><strong>Description:</strong> {details.description}</p>
        <p className="mb-2"><strong>O*NET-SOC Code:</strong> {details.code}</p>
        <h4 className="text-lg font-semibold mb-2">Sample Job Titles:</h4>
        <ul className="list-disc list-inside mb-2">
          {details.sample_of_reported_job_titles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
        <p><strong>Updated:</strong> {details.updated}</p>
      </div>
    );
  };

  const renderAutomationAnalysis = (occupation) => {
    if (!occupation) return null;

    console.log('Rendering Automation Analysis');
    console.log('Occupation:', occupation);

    const categories = [
      { name: 'Tasks', items: occupation.tasks, category: 'tasks' },
      { name: 'Knowledge', items: occupation.knowledge, category: 'knowledge' },
      { name: 'Skills', items: occupation.skills, category: 'skills' },
      { name: 'Abilities', items: occupation.abilities, category: 'abilities' },
      { name: 'Technologies', items: occupation.technologies, category: 'technologies' }
    ];

    const categoryAPOs = categories.map(category => {
      if (!category.items || !Array.isArray(category.items)) {
        console.log(`No valid items for category: ${category.name}`);
        return 0;
      }
      const apo = getAverageAPO(category.items, category.category);
      console.log(`${category.name} APO: ${apo.toFixed(2)}%`);
      return apo;
    });

    const validAPOs = categoryAPOs.filter(apo => apo > 0);
    const overallAPO = validAPOs.length > 0 ? validAPOs.reduce((sum, apo) => sum + apo, 0) / validAPOs.length : 0;
    console.log(`Overall APO: ${overallAPO.toFixed(2)}%`);

    return (
      <div className="mb-4 bg-gray-100 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Automation Exposure Analysis</h3>
        <p className="text-lg font-semibold mb-2">Overall APO: {overallAPO.toFixed(2)}%</p>
        {categories.map((category, index) => (
          <p key={category.name} className="mb-1">
            {category.name} APO: {categoryAPOs[index].toFixed(2)}%
          </p>
        ))}
      </div>
    );
  };

  const downloadExcel = () => {
    if (!selectedOccupation) return;

    const data = [
      { title: 'Tasks', items: selectedOccupation.tasks, category: 'tasks' },
      { title: 'Knowledge', items: selectedOccupation.knowledge, category: 'knowledge' },
      { title: 'Skills', items: selectedOccupation.skills, category: 'skills' },
      { title: 'Abilities', items: selectedOccupation.abilities, category: 'abilities' },
      { title: 'Technologies', items: selectedOccupation.technologies, category: 'technologies' }
    ];

    const worksheet = XLSX.utils.json_to_sheet([]);
    data.forEach(section => {
      XLSX.utils.sheet_add_json(worksheet, [{ title: section.title }], { skipHeader: true, origin: -1 });
      const itemsWithAPO = section.items.map(item => ({
        ...item,
        APO: calculateAPO(item, section.category)
      }));
      XLSX.utils.sheet_add_json(worksheet, itemsWithAPO, { origin: -1 });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Occupation Details');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${selectedOccupation.title}_details.xlsx`);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // TODO: Implement category filtering logic
    console.log(`Selected category: ${category}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">O*NET Career Explorer</h1>
      <DropdownNavigation onSelect={handleCategorySelect} />
      <div className="flex gap-2 mb-4">
        <SearchAutocomplete
          onSelect={(term) => setSearchTerm(term)}
          onSearch={handleSearch}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <Input
        type="file"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {results.length > 0 && (
        <Card className="mb-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Search Results</h2>
            <ul className="space-y-2">
              {results.map(occupation => (
                <li key={occupation.code}>
                  <Button
                    variant="ghost"
                    onClick={() => handleOccupationSelect(occupation)}
                    className="w-full text-left"
                  >
                    {occupation.title}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {selectedOccupation && (
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">{selectedOccupation.title}</h2>
            <InteractiveChart data={selectedOccupation} />
            {renderAdditionalDetails(selectedOccupation)}
            {renderAutomationAnalysis(selectedOccupation)}
            <Accordion type="single" collapsible className="mb-4">
              <AccordionItem value="tasks">
                <AccordionTrigger>Tasks</AccordionTrigger>
                <AccordionContent>{renderList('Tasks', selectedOccupation.tasks, 'tasks')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="knowledge">
                <AccordionTrigger>Knowledge</AccordionTrigger>
                <AccordionContent>{renderList('Knowledge', selectedOccupation.knowledge, 'knowledge')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="skills">
                <AccordionTrigger>Skills</AccordionTrigger>
                <AccordionContent>{renderList('Skills', selectedOccupation.skills, 'skills')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="abilities">
                <AccordionTrigger>Abilities</AccordionTrigger>
                <AccordionContent>{renderList('Abilities', selectedOccupation.abilities, 'abilities')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="technologies">
                <AccordionTrigger>Technologies</AccordionTrigger>
                <AccordionContent>{renderList('Technologies', selectedOccupation.technologies, 'technologies')}</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={downloadExcel} className="mt-4">
              Download as Excel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobTaxonomySelector;