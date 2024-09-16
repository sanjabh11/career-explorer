// src/components/EnhancedDashboard.tsx

import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { searchOccupations, getOccupationDetails } from '@/services/OnetService';
import { Occupation, OccupationDetails, TopCareer } from '@/types/onet';
import LoadingSpinner from './LoadingSpinner';
import { getColorForAPO } from '@/utils/dataProcessing';
import styles from '@/styles/EnhancedDashboard.module.css';
import AutomationPotentialChart from './AutomationPotentialChart';
import CategoryAccordion from './CategoryAccordion';

const EnhancedDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState<OccupationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'radar'>('bar');

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchOccupations(searchTerm);
      setOccupations(results);
      if (results.length === 0) {
        setError('No results found. Please try a different search term.');
      }
    } catch (err) {
      setError('Failed to search occupations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOccupationSelect = async (occupation: Occupation) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await getOccupationDetails(occupation.code);
      setSelectedOccupation(details);
    } catch (err) {
      setError('Failed to fetch occupation details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const topCareers: TopCareer[] = [
    { title: "Software Developer", apo: 65, code: "15-1252.00" },
    { title: "Data Scientist", apo: 72, code: "15-2051.00" },
    { title: "UX Designer", apo: 58, code: "27-1021.00" },
    { title: "Network Administrator", apo: 61, code: "15-1244.00" },
    { title: "Cybersecurity Analyst", apo: 70, code: "15-1212.00" },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Analysis of Skill set exposure due to GenAI</h1>
      <p className={styles.dashboardSubtitle}>Data sourced from <a href="https://www.onetcenter.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">O*NET Resource Center</a></p>
      
      <div className={styles.searchContainer}>
        <Input
          type="text"
          placeholder="Search for occupations or skills"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && <LoadingSpinner />}

      <div className={styles.mainContent}>
        <div className={styles.occupationDetails}>
          {selectedOccupation && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{selectedOccupation.title}</span>
                  <span className="text-sm font-normal text-gray-500">O*NET-SOC Code: {selectedOccupation.code}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">{selectedOccupation.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">Overall APO:</span>
                  <div className="flex items-center">
                    <Progress 
                      value={selectedOccupation.overallAPO ?? 0} 
                      className={`w-32 mr-2 ${getColorForAPO(selectedOccupation.overallAPO ?? 0)}`} 
                    />
                    <span className="text-2xl font-bold">{(selectedOccupation.overallAPO ?? 0).toFixed(2)}%</span>
                  </div>
                </div>
                <AutomationPotentialChart
                  occupationData={selectedOccupation}
                  chartType={chartType}
                />
                <Select onValueChange={(value) => setChartType(value as 'bar' | 'pie' | 'radar')}>
                  <SelectTrigger className="w-[180px] mt-4">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="radar">Radar Chart</SelectItem>
                  </SelectContent>
                </Select>
                <Tabs defaultValue="categories" className="w-full mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="details">Detailed View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="categories">
                    <div className="w-full">
                      {selectedOccupation.categories.map((category, index) => (
                        <CategoryAccordion
                          key={index}
                          category={category}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="details">
                    <ScrollArea className={styles.detailedView}>
                      {selectedOccupation.categories.map((category, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                          {category.details.map((item, itemIndex) => (
                            <div key={itemIndex} className="mb-2">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <div className="flex items-center mt-1">
                                <Progress value={item.value} className={`w-24 mr-2 ${getColorForAPO(item.value)}`} />
                                <span className="text-xs">Value: {item.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className={styles.sidebarContent}>
          <Card>
            <CardHeader>
              <CardTitle>Top Careers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topCareers.map((career, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{career.title}</span>
                    <div className="flex items-center">
                      <Progress value={career.apo} className={`w-24 mr-2 ${getColorForAPO(career.apo)}`} />
                      <span className="text-sm font-semibold mr-2">{career.apo}% APO</span>
                      <Button variant="outline" size="sm" onClick={() => handleOccupationSelect({ code: '', title: career.title })}>
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;