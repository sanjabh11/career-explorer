import { ReactNode } from 'react';

export interface DetailData {
  name: string;
  description: string;
  value: number;
}

export interface CategoryData {
  name: string;
  icon: ReactNode;
  apo: number;
  details: DetailData[];
}

export interface OccupationData {
  title: string;
  description: string;
  code: string;
  overallAPO: number;
  categories: CategoryData[];
}

export interface TopCareer {
  title: string;
  apo: number;
}