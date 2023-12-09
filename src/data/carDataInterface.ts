export interface CarData {
    state: string;
    passenger_km: number;
    // ... include other fields as needed
}

export interface YearlyData {
    [year: string]: CarData[];
}