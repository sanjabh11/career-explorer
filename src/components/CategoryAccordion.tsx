import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DetailData } from '@/types/onet';

interface CategoryAccordionProps {
  category: string;
  details: DetailData[];
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ category, details }) => {
  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value={category}>
        <AccordionTrigger>{category}</AccordionTrigger>
        <AccordionContent>
          {details.map((detail, index) => (
            <div key={index} className="mb-2">
              <h4 className="font-semibold">{detail.name}</h4>
              <p className="text-sm mb-1">{detail.description}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Progress value={detail.value * 100} className="mt-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Automation Potential: {(detail.value * 100).toFixed(2)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryAccordion;