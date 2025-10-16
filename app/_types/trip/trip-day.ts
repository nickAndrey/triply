export type Day = {
  dayNumber: number;
  theme: string;
  summary: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  insiderTips: [string, string, ...string[]];
  hiddenGem: string;
};

export type Activity = {
  name: string;
  description: string;
  budget: '$' | '$$' | '$$$';
  type: 'activity' | 'restaurant' | 'cafe' | 'bar';
};
