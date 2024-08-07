import React, { useState, useEffect } from 'react';
import { searchOccupations, getOccupationDetails } from '../services/OnetService';

const JobTaxonomySelector = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const occupations = await searchOccupations(searchTerm);
      setResults(occupations);
    } catch (error) {
      console.error('Error searching occupations:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOccupationSelect = async (occupation) => {
    console.log('Selected occupation:', occupation);
    setIsLoading(true);
    try {
      const details = await getOccupationDetails(occupation.code);
      setSelectedOccupation({ ...occupation, ...details });
    } catch (error) {
      console.error('Error fetching occupation details:', error);
      alert('An error occurred while fetching occupation details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderList = (title, items) => {
    if (!items || items.length === 0) {
      return (
        <>
          <h3>{title}</h3>
          <p>No {title.toLowerCase()} information available for this occupation.</p>
        </>
      );
    }
    return (
      <>
        <h3>{title}</h3>
        <ul>
          {items.map((item, index) => {
            if (typeof item === 'object') {
              return (
                <li key={index}>
                  <strong>{item.name || item.element_name || item.example}</strong>: {item.description}
                  {item.score && <span> (Importance: {item.score.value})</span>}
                </li>
              );
            }
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </>
    );
  };

  const renderAdditionalDetails = (details) => {
    return (
      <div>
        <h3>Additional Details</h3>
        <p><strong>Description:</strong> {details.description}</p>
        <p><strong>Job Zone:</strong> {details.job_zone}</p>
        <h4>Sample Job Titles:</h4>
        <ul>
          {details.sample_of_reported_job_titles.title.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
        <p><strong>Updated:</strong> {details.updated.year}</p>
      </div>
    );
  };

  return (
    <div>
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
          {renderList('Tasks', selectedOccupation.tasks)}
          {renderList('Skills', selectedOccupation.skills)}
          {renderList('Technologies', selectedOccupation.technologies)}
          {renderAdditionalDetails(selectedOccupation.details)}
        </div>
      )}
    </div>
  );
};

export default JobTaxonomySelector;