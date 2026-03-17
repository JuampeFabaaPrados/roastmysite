export type RoastCategory = {
  score: number;
  issues: string[];
  recommendations: string[];
};

export type RoastResult = {
  overallScore: number;
  summary: string;
  seo: RoastCategory;
  copy: RoastCategory;
  ux: RoastCategory;
  conversion: RoastCategory;
  topPriorities: string[];
  roast: string;
};