import { OccupationData, CategoryData, DetailData } from '@/types/dashboard';

export const processOccupationData = (rawData: any): OccupationData => {
  // Implementation as provided in the V0_recom.txt file
  return {
    title: rawData.title || '',
    description: rawData.description || '',
    code: rawData.code || '',
    overallAPO: rawData.overallAPO || 0,
    categories: rawData.categories.map((category: any): CategoryData => ({
      name: category.name || '',
      icon: category.icon || null,
      apo: category.apo || 0,
      details: category.details.map((detail: any): DetailData => ({
        name: detail.name || '',
        description: detail.description || '',
        value: detail.value || 0,
      })),
    })),
  };
};

export const calculateOverallAPO = (categories: CategoryData[]): number => {
  const totalAPO = categories.reduce((sum, category) => sum + category.apo, 0);
  return totalAPO / categories.length;
};

export const getColorForAPO = (apo: number): string => {
  if (apo < 33) return 'bg-green-500';
  if (apo < 66) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const sortOccupationsByAPO = (occupations: OccupationData[]): OccupationData[] => {
  return [...occupations].sort((a, b) => b.overallAPO - a.overallAPO);
};

export const filterOccupations = (occupations: OccupationData[], searchTerm: string): OccupationData[] => {
  const lowercasedSearchTerm = searchTerm.toLowerCase();
  return occupations.filter(
    (occupation) =>
      occupation.title.toLowerCase().includes(lowercasedSearchTerm) ||
      occupation.description.toLowerCase().includes(lowercasedSearchTerm) ||
      occupation.categories.some((category) =>
        category.name.toLowerCase().includes(lowercasedSearchTerm) ||
        category.details.some((detail) =>
          detail.name.toLowerCase().includes(lowercasedSearchTerm) ||
          detail.description.toLowerCase().includes(lowercasedSearchTerm)
        )
      )
  );
};