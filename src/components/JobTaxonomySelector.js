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
  "Technology Skills": {
    "Development Environment": 55, "Presentation Software": 50,
    "Object Oriented Development": 60, "Web Platform Development": 65,
    "Database Management": 70, "Operating System": 45,
    "Data Base User Interface": 55, "Compiler and Decompiler": 50,
    "Enterprise Resource Planning": 60, "Enterprise Application Integration": 65
  }
};

const calculateAPO = (item, category) => {
  if (!item || (!item.name && !item.title)) {
    console.warn(`Invalid item in category ${category}:`, item);
    return 0;
  }

  const itemName = item.name || item.title || '';
  const itemDescription = item.description || '';
  const fullText = `${itemName} ${itemDescription}`.toLowerCase();

  console.log(`Calculating APO for item: "${itemName}" in category: "${category}"`);
  console.log(`Full text: "${fullText}"`);

  if (category === 'Technology Skills') {
    return apoCategoriesPercentages['Technology Skills']['Development Environment'] || 55;
  }

  for (const [key, value] of Object.entries(apoCategoriesPercentages[category] || {})) {
    if (fullText.includes(key.toLowerCase())) {
      console.log(`Matched "${key}" in category "${category}" with APO ${value}%`);
      return value;
    }
  }

  const averageCategoryAPO = Object.values(apoCategoriesPercentages[category] || {}).reduce((a, b) => a + b, 0) / Object.values(apoCategoriesPercentages[category] || {}).length || 0;
  console.log(`No exact match found for "${itemName}" in category "${category}". Using average category APO: ${averageCategoryAPO.toFixed(2)}%`);
  return averageCategoryAPO;
};

const getAverageAPO = (items, category) => {
  if (!items || items.length === 0) {
    console.log(`No items found for category: ${category}`);
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
      console.log('Processed search results:', occupations);
      setResults(occupations);
    } catch (error) {
      console.error('Error searching occupations:', error);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
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
      console.log('Occupation details received:', details);
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
                primary={<strong>{item.name || item.title || 'Unnamed Item'}</strong>}
                secondary={
                  <>
                    {item.description || 'No description available'}
                    {item.value && <span> (Value: {item.value})</span>}
                    {item.scale && <span> (Scale: {item.scale})</span>}
                    <br />
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
          {details.sample_of_reported_job_titles?.title?.map((title, index) => (
            <ListItem key={index}>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
        <Typography variant="body2"><strong>Updated:</strong> {details.updated?.year}</Typography>
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
      { name: 'Technology Skills', items: occupation.technologies, category: 'Technology Skills' }
    ];

    const categoryAPOs = categories.map(category => {
      const apo = getAverageAPO(category.items, category.category);
      console.log(`${category.name} APO: ${apo.toFixed(2)}%`);
      return apo;
    });

    const overallAPO = categoryAPOs.reduce((sum, apo) => sum + apo, 0) / categories.length;
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

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add occupation title and description
    XLSX.utils.sheet_add_json(worksheet, [
      { A: 'Occupation', B: selectedOccupation.title },
      { A: 'Description', B: selectedOccupation.description },
      { A: 'O*NET-SOC Code', B: selectedOccupation.code },
      { A: 'Updated', B: selectedOccupation.updated?.year },
      {}  // Empty row for spacing
    ], { skipHeader: true, origin: 'A1' });

    // Add Automation Exposure Analysis
    const categories = [
      { name: 'Tasks', items: selectedOccupation.tasks, category: 'tasks' },
      { name: 'Knowledge', items: selectedOccupation.knowledge, category: 'knowledge' },
      { name: 'Skills', items: selectedOccupation.skills, category: 'skills' },
      { name: 'Abilities', items: selectedOccupation.abilities, category: 'abilities' },
      { name: 'Technology Skills', items: selectedOccupation.technologies, category: 'Technology Skills' }
    ];

    const categoryAPOs = categories.map(category => getAverageAPO(category.items, category.category));
    const overallAPO = categoryAPOs.reduce((sum, apo) => sum + apo, 0) / categories.length;

    XLSX.utils.sheet_add_json(worksheet, [
      { A: 'Automation Exposure Analysis' },
      { A: 'Overall APO', B: overallAPO.toFixed(2) + '%' },
      ...categories.map((category, index) => ({ A: `${category.name} APO`, B: categoryAPOs[index].toFixed(2) + '%' })),
      {}  // Empty row for spacing
    ], { skipHeader: true, origin: -1 });

    // Add detailed information for each category
    categories.forEach(category => {
      XLSX.utils.sheet_add_json(worksheet, [{ A: category.name }], { skipHeader: true, origin: -1 });
      XLSX.utils.sheet_add_json(worksheet, [{ A: 'Name', B: 'Description', C: 'Value', D: 'Scale', E: 'APO' }], { origin: -1 });
      const itemsWithAPO = category.items.map(item => ({
        A: item.name || item.title,
        B: item.description,
        C: item.value,
        D: item.scale,
        E: calculateAPO(item, category.category).toFixed(2) + '%'
      }));
      XLSX.utils.sheet_add_json(worksheet, itemsWithAPO, { origin: -1 });
      XLSX.utils.sheet_add_json(worksheet, [{}], { origin: -1 });  // Empty row for spacing
    });

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
      {results && results.length > 0 ? (
        <List>
          {results.map(occupation => (
            <ListItem button key={occupation.code} onClick={() => handleOccupationSelect(occupation)}>
              <ListItemText primary={occupation.title} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No results found.</Typography>
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
          {renderList('Technology Skills', selectedOccupation.technologies, 'Technology Skills')}
          <Button variant="contained" color="secondary" onClick={downloadExcel} style={{ marginTop: '16px' }}>
            Download as Excel
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default JobTaxonomySelector;
  
