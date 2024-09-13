import React, { useState } from 'react'; // Removed useEffect and useCallback as they are not used
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Occupation } from '@/types/onet';

interface SearchAutocompleteProps {
  options: Occupation[];
  onSelect: (occupation: Occupation) => void;
  onSearch: (searchTerm: string) => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ options, onSelect, onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value); // Call onSearch with the current input value
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  return (
    <div className="relative w-3/4">
      <Input
        type="text"
        placeholder="Search for occupations"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
      />
      <Button onClick={handleSearch}>Search</Button>
      {options.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(option); // Ensure onSelect is called correctly
                setInputValue(option.title);
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

export default SearchAutocomplete;