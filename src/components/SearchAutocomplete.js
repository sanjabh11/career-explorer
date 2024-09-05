import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input"
import { searchOccupations } from '../services/OnetService';
import debounce from 'lodash/debounce';

export const SearchAutocomplete = ({ onSelect, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.trim()) {
        try {
          const results = await searchOccupations(value);
          setOptions(results);
        } catch (error) {
          console.error('Error in debounced search:', error);
          setOptions([]);
        }
      } else {
        setOptions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => debouncedSearch.cancel();
  }, [inputValue, debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (!value.trim()) {
      setOptions([]);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for occupations"
        value={inputValue}
        onChange={handleInputChange}
      />
      {options.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(option.title);
                onSearch();
                setInputValue(option.title);
                setOptions([]);
              }}
            >
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};