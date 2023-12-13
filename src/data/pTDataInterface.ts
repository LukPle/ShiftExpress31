export interface TransportData {
    state: string
    total_local_passengers: number
    total_local_passenger_km: number
    railway_local_passengers: number
    railway_local_passenger_km: number
    tramway_local_passengers: number
    tramway_local_passenger_km: number
    bus_local_passengers: number
    bus_local_passenger_km: number
    bus_longdistance_passengers: number
    bus_longdistance_passenger_km: number
    railway_longdistance_passengers: number
    railway_longdistance_passenger_km: number
}

export interface YearlyData {
    [year: string]: TransportData[];
}

export interface YearlyTotalPassengerKM {
    [year: string]: number;
}