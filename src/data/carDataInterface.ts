export interface CarData {
    state: string;
    per_car_km: number;
    per_car_pass_km: number;
    cars: number;
    passenger_km: number;
    // ... include other fields as needed
}

export interface YearlyData {
    [year: string]: CarData[];
}