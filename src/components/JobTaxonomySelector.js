import React, { useState } from 'react';
import { searchOccupations, getOccupationDetails } from '../services/OnetService';

const JobTaxonomySelector = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);

  const handleSearch = async () => {
    try {
      const results = await searchOccupations(searchTerm);
      setOccupations(results);
    } catch (error) {
      console.error('Error searching occupations:', error);
    }
  };

  const handleOccupationSelect = async (occupation) => {
    try {
      console.log('Selected occupation:', occupation);
      const details = await getOccupationDetails(occupation.code[0]);
      setSelectedOccupation(details);
    } catch (error) {
      console.error('Error fetching occupation details:', error);
    }
  };
  const renderList = (title, items) => {
    if (!items || items.length === 0) {
      return (
        <>
          <h3>{title}</h3>
          <p>No {title.toLowerCase()} information is currently available for this occupation.</p>
        </>
      );
    }
    return (
      <>
        <h3>{title}</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>{item.name || item.title}</strong>: {item.description}
              {item.value && <span> (Value: {item.value}, Scale: {item.scale})</span>}
            </li>
          ))}
        </ul>
      </>
    );
  };

  const renderAdditionalDetails = (details) => {
    return (
      <div>
        <h3>Additional Details</h3>
        <p><strong>Description:</strong> {details.description}</p>
        <p><strong>O*NET-SOC Code:</strong> {details.code}</p>
        <h4>Sample Job Titles:</h4>
        <ul>
          {details.sample_of_reported_job_titles?.title?.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
        <p><strong>Updated:</strong> {details.updated?.year}</p>
      </div>
    );
  };

  const downloadExcel = () => {
    if (!selectedOccupation) return;

    const data = [
      { title: 'Tasks', items: selectedOccupation.tasks },
      { title: 'Knowledge', items: selectedOccupation.knowledge },
      { title: 'Skills', items: selectedOccupation.skills },
      { title: 'Abilities', items: selectedOccupation.abilities },
      { title: 'Technologies', items: selectedOccupation.technologies }
    ];

    const worksheet = XLSX.utils.json_to_sheet([]);
    data.forEach(section => {
      XLSX.utils.sheet_add_json(worksheet, [{ title: section.title }], { skipHeader: true, origin: -1 });
      XLSX.utils.sheet_add_json(worksheet, section.items, { origin: -1 });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Occupation Details');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${selectedOccupation.title}_details.xlsx`);
  };

  return (
    <div>
      <h1>O*NET Career Explorer</h1>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for occupations"
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {results.length > 0 && (
        <ul>
          {results.map(occupation => (
            <li key={occupation.code} onClick={() => handleOccupationSelect(occupation)}>
              {occupation.title}
            </li>
          ))}
        </ul>
      )}
      {selectedOccupation && (
        <div>
          <h2>{selectedOccupation.title}</h2>
          {renderAdditionalDetails(selectedOccupation)}
          {renderList('Tasks', selectedOccupation.tasks)}
          {renderList('Knowledge', selectedOccupation.knowledge)}
          {renderList('Skills', selectedOccupation.skills)}
          {renderList('Abilities', selectedOccupation.abilities)}
          {renderList('Technologies', selectedOccupation.technologies)}
          <button onClick={downloadExcel}>Download as Excel</button>
        </div>
      )}
    </div>
  );
};

export default JobTaxonomySelector;