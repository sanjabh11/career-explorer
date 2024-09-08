import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Occupation } from '@/types/onet';

interface SearchAutocompleteProps {
  onSelect: (occupation: Occupation) => void;
  onSearch: (term: string) => void;
  options: Occupation[];
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSelect, onSearch, options }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Occupation[]>([]);

  useEffect(() => {
    console.log('Options updated:', options);
    setFilteredOptions(options);
  }, [options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(
      options.filter((option) =>
        option.title.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleOptionClick = (occupation: Occupation) => {
    setInputValue(occupation.title);
    onSelect(occupation);
    setFilteredOptions([]);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for occupations..."
          className="w-full"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option.code}
              onClick={() => handleOptionClick(option)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};