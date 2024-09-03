import React, { useState, useEffect } from 'react';
import { searchOccupations, getOccupationDetails } from '../services/OnetService';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { TextField, Button, CircularProgress, Typography, List, ListItem, ListItemText, Container, Paper, Box, Input } from '@mui/material';

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
        <Box my={2}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">No {title.toLowerCase()} information is currently available for this occupation.</Typography>
        </Box>
      );
    }
    const averageAPO = getAverageAPO(items, category);
    return (
      <Box my={2}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">Average APO: {averageAPO.toFixed(2)}%</Typography>
        <List>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={<strong>{item.name || 'Unnamed Item'}</strong>}
                secondary={
                  <>
                    {item.description && (
                      <span>{item.description}<br /></span>
                    )}
                    {item.value && (
                      <span>
                        Value: {item.value}, 
                        Scale: {item.scale}
                        <br />
                      </span>
                    )}
                    {category === 'technologies' && (
                      <>
                        Commodity Code: {item.commodityCode || 'N/A'}<br />
                        Hot Technology: {item.hotTechnology ? 'Yes' : 'No'}<br />
                      </>
                    )}
                    APO: {calculateAPO(item, category).toFixed(2)}%
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderAdditionalDetails = (details) => {
    return (
      <Box my={2}>
        <Typography variant="h6">Additional Details</Typography>
        <Typography variant="body2"><strong>Description:</strong> {details.description}</Typography>
        <Typography variant="body2"><strong>O*NET-SOC Code:</strong> {details.code}</Typography>
        <Typography variant="h6">Sample Job Titles:</Typography>
        <List>
          {details.sample_of_reported_job_titles.map((title, index) => (
            <ListItem key={index}>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
        <Typography variant="body2"><strong>Updated:</strong> {details.updated}</Typography>
      </Box>
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
      <Box my={2}>
        <Typography variant="h6">Automation Exposure Analysis</Typography>
        <Typography variant="body2">Overall APO: {overallAPO.toFixed(2)}%</Typography>
        {categories.map((category, index) => (
          <Typography key={category.name} variant="body2">
            {category.name} APO: {categoryAPOs[index].toFixed(2)}%
          </Typography>
        ))}
      </Box>
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>O*NET Career Explorer</Typography>
      <TextField
        label="Search for occupations"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSearch} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Search'}
      </Button>
      <Input
        type="file"
        onChange={handleFileUpload}
        style={{ marginLeft: '10px' }}
      />
      {error && (
        <Typography color="error" variant="body2" gutterBottom>{error}</Typography>
      )}
      {results.length > 0 && (
        <List>
          {results.map(occupation => (
            <ListItem button key={occupation.code} onClick={() => handleOccupationSelect(occupation)}>
              <ListItemText primary={occupation.title} />
            </ListItem>
          ))}
        </List>
      )}
      {selectedOccupation && (
        <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
          <Typography variant="h5">{selectedOccupation.title}</Typography>
          {renderAdditionalDetails(selectedOccupation)}
          {renderAutomationAnalysis(selectedOccupation)}
          {renderList('Tasks', selectedOccupation.tasks, 'tasks')}
          {renderList('Knowledge', selectedOccupation.knowledge, 'knowledge')}
          {renderList('Skills', selectedOccupation.skills, 'skills')}
          {renderList('Abilities', selectedOccupation.abilities, 'abilities')}
          {renderList('Technologies', selectedOccupation.technologies, 'technologies')}
          <Button variant="contained" color="secondary" onClick={downloadExcel} style={{ marginTop: '16px' }}>
            Download as Excel
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default JobTaxonomySelector;