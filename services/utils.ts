import { PlayerCategory, CategoryRule } from "../types";

export const getCategoryByYear = (dob: string, rules: CategoryRule[]): PlayerCategory => {
    if (!dob || !rules) return 'Uncategorized';
    
    const birthYear = new Date(dob).getFullYear();

    for (const rule of rules) {
        if (birthYear >= rule.startYear && birthYear <= rule.endYear) {
            return rule.name;
        }
    }
    
    return 'Uncategorized';
};

export const stringToHash = (str: string): number => {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};