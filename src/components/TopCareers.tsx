// src/components/TopCareers.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Info } from 'lucide-react';
import { Occupation } from '@/types/onet';
import styles from '@/styles/TopCareers.module.css';

interface TopCareersProps {
  onSelect: (occupation: Occupation) => void;
}

const topCareers = [
  { title: "Software Developer", apo: 65, code: "15-1252.00" },
  { title: "Data Scientist", apo: 72, code: "15-2051.00" },
  { title: "UX Designer", apo: 58, code: "27-1021.00" },
  { title: "Network Administrator", apo: 61, code: "15-1244.00" },
  { title: "Cybersecurity Analyst", apo: 70, code: "15-1212.00" },
];

const TopCareers: React.FC<TopCareersProps> = ({ onSelect }) => {
  return (
    <Card className={styles.topCareersCard}>
      <CardHeader>
        <CardTitle>Top Careers</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={styles.careerList}>
          {topCareers.map((career, index) => (
            <li key={index} className={styles.careerItem}>
              <span>{career.title}</span>
              <div className={styles.careerDetails}>
                <Progress value={career.apo} className={styles.careerProgress} />
                <span className={styles.apoValue}>{career.apo}% APO</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelect({ code: career.code, title: career.title })}
                  className={styles.infoButton}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopCareers;