import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getColorForAPO } from '@/utils/dataProcessing';
import styles from '@/styles/EnhancedDashboard.module.css';
import { CategoryData } from '@/types/onet';

const CategoryAccordion: React.FC<{ category: CategoryData }> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.categoryAccordion}>
      <button
        className={styles.accordionButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {category.icon}
          <span className="ml-2 font-medium">{category.name}</span>
        </div>
        <div className="flex items-center">
          <Progress value={category.apo} className={`w-24 mr-2 ${getColorForAPO(category.apo)}`} />
          <span className="mr-2 text-sm font-semibold">{category.apo}% APO</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {isOpen && (
        <ScrollArea className={styles.accordionContent}>
          {category.details.map((item, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center mt-1">
                <Progress value={item.value} className={`w-24 mr-2 ${getColorForAPO(item.value)}`} />
                <span className="text-xs">Value: {item.value}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default CategoryAccordion;