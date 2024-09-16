import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { OccupationDetails, CategoryData, APOItem } from '@/types/onet';

export const downloadTemplate = (occupationDetails: OccupationDetails) => {
  const csvContent = Papa.unparse({
    fields: ['Category', 'Name', 'Description', 'Value'],
    data: occupationDetails.categories?.flatMap((category) =>
      category.details.map((detail) => [
        category.name,
        detail.name,
        detail.description,
        detail.value.toString(),
      ])
    ) ?? [],
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${occupationDetails.title.replace(/\s+/g, '_')}_apo_analysis.csv`);
};

export const parseUploadedFile = (file: File): Promise<OccupationDetails> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const categories: { [key: string]: CategoryData } = {};

        results.data.forEach((row) => {
          if (!categories[row.Category]) {
            categories[row.Category] = {
              name: row.Category,
              icon: undefined,
              apo: 0,
              details: [],
            };
          }

          const detail: APOItem = {
            name: row.Name,
            description: row.Description,
            value: parseFloat(row.Value),
          };

          categories[row.Category].details.push(detail);
        });

        Object.values(categories).forEach((category) => {
          category.apo = category.details.reduce((sum, detail) => sum + detail.value, 0) / category.details.length;
        });

        const occupationData: Partial<OccupationDetails> = {
          title: 'Custom APO Analysis',
          description: 'Uploaded custom APO analysis data',
          code: 'CUSTOM',
          overallAPO: Object.values(categories).reduce((sum, category) => sum + category.apo, 0) / Object.values(categories).length,
          categories: Object.values(categories),
          sample_of_reported_job_titles: [],
          updated: new Date().toISOString(),
          tasks: [],
          knowledge: [],
          skills: [],
          abilities: [],
          technologies: [],
        };

        resolve(occupationData as OccupationDetails);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};