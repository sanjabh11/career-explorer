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
  tasks: APOItem[];
  knowledge: APOItem[];
  skills: APOItem[];
  abilities: APOItem[];
  technologies: APOItem[];
}