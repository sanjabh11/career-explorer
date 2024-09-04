import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { searchOccupations } from '../services/OnetService';

export const SearchAutocomplete = ({ onSelect, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (inputValue) {
      searchOccupations(inputValue).then(results => {
        setOptions(results);
      });
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for occupations"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
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
                setInputValue('');
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