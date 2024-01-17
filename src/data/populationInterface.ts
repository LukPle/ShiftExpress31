export interface PopulationData {
    state: string;
    population: number;
}

export interface YearlyData {
  [year: string]: PopulationData[];
}