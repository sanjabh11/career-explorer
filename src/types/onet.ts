export interface APOCategories {
  tasks: Record<string, number>;
  knowledge: Record<string, number>;
  skills: Record<string, number>;
  abilities: Record<string, number>;
  technologies: Record<string, number>;
}

export interface APOItem {
  name?: string;
  title?: string;
  description?: string;
  value?: number;
  scale?: string;
  commodityCode?: string;
  hotTechnology?: boolean;
}

export interface Occupation {
  code: string;
  title: string;
}

export interface OccupationDetails extends Occupation {
  description: string;
  sample_of_reported_job_titles: string[];
  updated: string;
  overallAPO?: number;
  categories?: CategoryData[];
  tasks: APOItem[];
  knowledge: APOItem[];
  skills: APOItem[];
  abilities: APOItem[];
  technologies: APOItem[];
}

export interface CategoryData {
  name: string;
  apo: number;
  details: DetailData[];
  icon?: string;
}

export interface DetailData {
  name: string;
  description: string;
  value: number;
}

export interface TopCareer {
  title: string;
  apo: number;
}