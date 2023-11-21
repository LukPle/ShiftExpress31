export interface TransportData {
    state: string;
    total_local_passengers: number;
    total_local_passenger_km: number;
    // ... include other fields as needed
}

export interface YearlyData {
    [year: string]: TransportData[];
}
