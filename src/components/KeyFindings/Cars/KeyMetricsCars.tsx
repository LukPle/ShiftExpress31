import React, { useEffect, useState, useRef } from 'react';
import { YearlyData as CarYearlyData, CarData } from '@/data/carDataInterface';
import { YearlyData as TransportYearlyData, TransportData } from '@/data/pTDataInterface';
import { Stack, Typography, Divider } from "@mui/joy";
import { FilterOptions } from './Cars';
import theme from '@/utils/theme';
import { animate } from "framer-motion";

// Counter component
//@ts-ignore
function Counter({ from, to, prefix = "", suffix = "" }) {
    const nodeRef = useRef();

    useEffect(() => {
        const node = nodeRef.current;

        const controls = animate(from, to, {
            duration: 1,
            onUpdate(value) {

                const formattedValue = formatLargeNumber(value);
                //@ts-ignore
                node.textContent = prefix + formattedValue + suffix;
            },
        });

        return () => controls.stop();
    }, [from, to, prefix, suffix]);
    //@ts-ignore
    return <span ref={nodeRef} />;
}

function formatLargeNumber(num:number) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + ' trl';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + ' bil';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + ' mil';
    } else {
        return num.toFixed(2);
    }
}
interface KeyMetricsProps {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    startYear: string;
    endYear: string;
    currentFilter: FilterOptions;
}

const KeyMetricsCars: React.FC<KeyMetricsProps> = ({ carData, transportData, startYear, endYear, currentFilter }) => {
    const [carPercentageChange, setCarPercentageChange] = useState<number>(0);
    const [transportPercentageChange, setTransportPercentageChange] = useState<number>(0);
    const [previousCarPercentageChange, setPreviousCarPercentageChange] = useState<number>(0);
    const [previousTransportPercentageChange, setPreviousTransportPercentageChange] = useState<number>(0);
    // Total Passenger_km
    const [totalPassengerKm, setTotalPassengerKm] = useState<number>(0);
    const [previousTotalPassengerKm, setPreviousTotalPassengerKm] = useState<number>(0);
    //Total Local_Passenger_KM
    const [totalLocalPassengerKm, setTotalLocalPassengerKm] = useState<number>(0);
    const [previousTotalLocalPassengerKm, setPreviousTotalLocalPassengerKm] = useState<number>(0);
    //Total Number of Cars
    const [numberOfCars, setNumberOfCars] = useState<number>(0);
    const [previousNumberOfCars, setPreviousNumberOfCars] = useState<number>(0);



    useEffect(() => {
        setPreviousCarPercentageChange(carPercentageChange);
        setPreviousTransportPercentageChange(transportPercentageChange);
        setCarPercentageChange(calculatePercentageChange(carData, 'passenger_km', startYear, endYear));
        setTransportPercentageChange(calculatePercentageChange(transportData, 'total_local_passenger_km', startYear, endYear));

        setPreviousTotalPassengerKm(totalPassengerKm);
        setTotalPassengerKm(calculateTotalPassengerKm(carData, startYear, endYear));

        setPreviousTotalLocalPassengerKm(totalLocalPassengerKm);
        setTotalLocalPassengerKm(calculateTotalLocalPassengerKm(transportData, startYear, endYear));

        setPreviousNumberOfCars(numberOfCars);
        setNumberOfCars(calculateNumberOfCars(carData, startYear, endYear));

    }, [carData, transportData, startYear, endYear, currentFilter]);

    const calculateTotalPassengerKm = (
        data: CarYearlyData,
        startYear: string,
        endYear: string
    ) => {
        // Calculate total passenger kilometers using only the 'FEDERAL' entry for each year
        return Object.entries(data)
            .filter(([year]) => parseInt(year) >= parseInt(startYear) && parseInt(year) <= parseInt(endYear))
            .reduce((total, [year, dataArray]) => {
                const federalData = dataArray.find(d => d.state === 'FEDERAL');
                return  (federalData ? federalData.passenger_km : 0);
            }, 0);
    };

    const calculateTotalLocalPassengerKm = (
        data: TransportYearlyData,
        startYear: string,
        endYear: string
    ) => {
        return Object.entries(data)
            .filter(([year]) => parseInt(year) >= parseInt(startYear) && parseInt(year) <= parseInt(endYear))
            .reduce((total, [year, dataArray]) => {
                const yearTotal = dataArray.reduce((acc, cur) => acc + cur.total_local_passenger_km, 0);
                return yearTotal;
            }, 0);
    };

    const calculateNumberOfCars = (
        data: CarYearlyData,
        startYear: string,
        endYear: string
    ) => {
        return Object.entries(data)
            .filter(([year]) => parseInt(year) >= parseInt(startYear) && parseInt(year) <= parseInt(endYear))
            .reduce((total, [year, dataArray]) => {
                const federalData = dataArray.find(d => d.state === 'FEDERAL');
                return  (federalData ? federalData.cars : 0);
            }, 0);
    };


    const calculatePercentageChange = (
        data: CarYearlyData | TransportYearlyData,
        metric: keyof CarData | keyof TransportData,
        startYear: string,
        endYear: string
    ) => {
        // Filter the data to include only the years within the startYear and endYear range
        const filteredData = Object.entries(data)
            .filter(([year]) => parseInt(year) >= parseInt(startYear) && parseInt(year) <= parseInt(endYear))
            .map(([year, dataArray]) => {
                const totalMetric = dataArray
                    // Filter out the 'FEDERAL' entry and sum up the metric for all other states
                    //@ts-ignore

                    .filter((d) => d.state !== 'FEDERAL')
                    //@ts-ignore

                    .reduce((acc, cur) => {
                        //@ts-ignore
                        return acc + cur[metric];
                    }, 0);
                return { year: parseInt(year), totalMetric };
            });

        // Ensure the data is sorted by year as filtering may disrupt the order
        filteredData.sort((a, b) => a.year - b.year);

        // Calculate the percentage change based on the first year's totalMetric
        const baseYearTotal = filteredData[0]?.totalMetric || 0;
        return baseYearTotal ? ((filteredData[filteredData.length - 1].totalMetric - baseYearTotal) / baseYearTotal) * 100 : 0;
    };

    const ptColor = "#9BC4FD";
    const carColor = '#FFA500';
    const unfocusedColor = '#E8E8E8';

    const getPercentStyle = (color: string, notHiglighted: boolean): React.CSSProperties => {
        return {
            color: color,
            opacity: notHiglighted ? 0.5 : 1,
            fontVariantNumeric: "tabular-nums"
        };
    };

    return (
        <>
            <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"end"} justifyContent={"flex-start"} gap={2}>
                {currentFilter === FilterOptions.CarsAbs && (
                    <>
                        <Typography sx={getPercentStyle(carColor, currentFilter === FilterOptions.FocusPublicTransport)} level='h4'>
                            <Counter
                                from={previousTotalPassengerKm}
                                to={totalPassengerKm}
                                prefix=""
                                suffix=" km 🚗"
                            />
                        </Typography>
                        <Divider orientation="vertical" />
                        <Typography sx={getPercentStyle(carColor, currentFilter === FilterOptions.FocusPublicTransport)} level='h4'>
                            <Counter
                                from={previousCarPercentageChange}
                                to={carPercentageChange}
                                prefix={Math.sign(carPercentageChange) >= 0 ? "+" : ""}
                                suffix="% 🚗"
                            />
                        </Typography>
                    </>
                )}
                {currentFilter === FilterOptions.Comparison && (
                    <>
                        <Typography sx={getPercentStyle(carColor, currentFilter === FilterOptions.FocusPublicTransport)} level='h4'>
                            <Counter
                                from={previousTotalPassengerKm}
                                to={totalPassengerKm}
                                prefix=""
                                suffix=" km 🚗"
                            />
                        </Typography>
                        <Divider orientation="vertical" />
                        <Typography sx={getPercentStyle(ptColor, currentFilter === FilterOptions.FocusCars)} level='h4'>
                            <Counter
                                from={previousTotalLocalPassengerKm}
                                to={totalLocalPassengerKm}
                                prefix=""
                                suffix=" km 🚊"
                            />
                        </Typography>
                    </>
                )}
                {currentFilter === FilterOptions.CarsDev && (
                    <>
                        <Typography sx={getPercentStyle(carColor, currentFilter === FilterOptions.FocusPublicTransport)} level='h4'>
                            <Counter
                                from={previousNumberOfCars}
                                to={numberOfCars}
                                prefix=""
                                suffix=" cars 🚗"
                            />
                        </Typography>
                        <Typography sx={{ color: "#646B73" }} level="body-xs">*since {startYear}</Typography>
                    </>
                )}
            </Stack>
            <Divider orientation="vertical" />
            <Typography level='h4'>{endYear}</Typography>
        </>
    );
};

export default KeyMetricsCars;