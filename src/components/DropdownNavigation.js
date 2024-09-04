import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const DropdownNavigation = ({ onSelect }) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Tasks">Tasks</SelectItem>
        <SelectItem value="Knowledge">Knowledge</SelectItem>
        <SelectItem value="Skills">Skills</SelectItem>
        <SelectItem value="Abilities">Abilities</SelectItem>
        <SelectItem value="Technologies">Technologies</SelectItem>
      </SelectContent>
    </Select>
  );
};