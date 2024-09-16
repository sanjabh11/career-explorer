import React, { useCallback } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { InteractiveChart } from './InteractiveChart';
import APOChart from './APOChart';
import { Occupation, OccupationDetails } from '@/types/onet';
import { useOccupationSearch } from '../hooks/useOccupationSearch';
import { useDebounce } from '../hooks/useDebounce';
import { calculateAPO, getAverageAPO } from '../utils/apoCalculations';
import { X, Search, Briefcase, Book, Brain, BarChart2, Cpu } from 'lucide-react';

const JobTaxonomySelector: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    results,
    selectedOccupation,
    isLoading,
    error,
    handleSearch,
    handleOccupationSelect,
  } = useOccupationSearch();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const renderAccordionContent = useCallback((title: string, items: any[], category: string) => {
    const averageAPO = getAverageAPO(items, category);
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center">
            <span className="mr-2">Average APO:</span>
            <Progress value={averageAPO} className="w-24" />
            <span className="ml-2">{averageAPO.toFixed(2)}%</span>
          </div>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-md">
              <div className="font-semibold">{item.name || 'Unnamed Item'}</div>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center mt-1">
                <span className="mr-2">APO:</span>
                <Progress value={calculateAPO(item, category)} className="w-24" />
                <span className="ml-2">{calculateAPO(item, category).toFixed(2)}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }, []);

  const renderAutomationAnalysis = useCallback((occupation: OccupationDetails) => {
    const categories = [
      { name: 'Tasks', items: occupation.tasks, category: 'tasks' },
      { name: 'Knowledge', items: occupation.knowledge, category: 'knowledge' },
      { name: 'Skills', items: occupation.skills, category: 'skills' },
      { name: 'Abilities', items: occupation.abilities, category: 'abilities' },
      { name: 'Technologies', items: occupation.technologies, category: 'technologies' }
    ];

    const categoryAPOs = categories.map(category => ({
      category: category.name,
      apo: getAverageAPO(category.items, category.category)
    }));

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Automation Exposure Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <APOChart data={categoryAPOs} />
        </CardContent>
      </Card>
    );
  }, []);

  const downloadExcel = useCallback(() => {
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
  }, [selectedOccupation]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">O*NET Career Explorer</h1>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for occupations or skills"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        {results.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {results.map((occupation: Occupation) => (
              <li
                key={occupation.code}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOccupationSelect(occupation)}
              >
                {occupation.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {selectedOccupation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{selectedOccupation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{selectedOccupation.description}</p>
                <h3 className="text-xl font-semibold mb-2">Sample Job Titles:</h3>
                <ul className="grid grid-cols-2 gap-2 mb-4">
                  {selectedOccupation.sample_of_reported_job_titles.map((title, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded">{title}</li>
                  ))}
                </ul>
                <p><strong>O*NET-SOC Code:</strong> {selectedOccupation.code}</p>
                <p><strong>Updated:</strong> {selectedOccupation.updated}</p>
              </CardContent>
            </Card>
            {renderAutomationAnalysis(selectedOccupation)}
          </div>
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Download Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadExcel} className="w-full">
                  Download as Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {selectedOccupation && (
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="tasks">
            <AccordionTrigger className="flex items-center">
              <Briefcase className="mr-2" /> Tasks
            </AccordionTrigger>
            <AccordionContent>
              {renderAccordionContent('Tasks', selectedOccupation.tasks, 'tasks')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="knowledge">
            <AccordionTrigger className="flex items-center">
              <Book className="mr-2" /> Knowledge
            </AccordionTrigger>
            <AccordionContent>
              {renderAccordionContent('Knowledge', selectedOccupation.knowledge, 'knowledge')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger className="flex items-center">
              <Brain className="mr-2" /> Skills
            </AccordionTrigger>
            <AccordionContent>
              {renderAccordionContent('Skills', selectedOccupation.skills, 'skills')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="abilities">
            <AccordionTrigger className="flex items-center">
              <BarChart2 className="mr-2" /> Abilities
            </AccordionTrigger>
            <AccordionContent>
              {renderAccordionContent('Abilities', selectedOccupation.abilities, 'abilities')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="technologies">
            <AccordionTrigger className="flex items-center">
              <Cpu className="mr-2" /> Technologies
            </AccordionTrigger>
            <AccordionContent>
              {renderAccordionContent('Technologies', selectedOccupation.technologies, 'technologies')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default JobTaxonomySelector;