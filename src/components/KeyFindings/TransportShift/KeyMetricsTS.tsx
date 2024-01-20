import React, { useEffect, useState, useRef } from 'react';
import { YearlyData as CarYearlyData, CarData } from '@/data/carDataInterface';
import { YearlyData as TransportYearlyData, TransportData } from '@/data/pTDataInterface';
import { Stack, Typography, Divider } from "@mui/joy";
import { FilterOptions } from './TransportShift';
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
                //@ts-ignore
                node.textContent = prefix + value.toFixed(2) + suffix;
            },
        });

        return () => controls.stop();
    }, [from, to, prefix, suffix]);
    //@ts-ignore
    return <span ref={nodeRef} />;
}


interface KeyMetricsProps {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    startYear: string;
    endYear: string;
    currentFilter: FilterOptions;
}

const KeyMetricsTS: React.FC<KeyMetricsProps> = ({ carData, transportData, startYear, endYear, currentFilter }) => {
    const [carPercentageChange, setCarPercentageChange] = useState<number>(0);
    const [transportPercentageChange, setTransportPercentageChange] = useState<number>(0);
    const [previousCarPercentageChange, setPreviousCarPercentageChange] = useState<number>(0);
    const [previousTransportPercentageChange, setPreviousTransportPercentageChange] = useState<number>(0);

    useEffect(() => {
        setPreviousCarPercentageChange(carPercentageChange);
        setPreviousTransportPercentageChange(transportPercentageChange);
        setCarPercentageChange(calculatePercentageChange(carData, 'passenger_km', startYear, endYear));
        setTransportPercentageChange(calculatePercentageChange(transportData, 'total_local_passenger_km', startYear, endYear));
    }, [carData, transportData, startYear, endYear, currentFilter]);

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

    const ptColor = theme.palette.primary[500];
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
                <Typography sx={getPercentStyle(ptColor, currentFilter === FilterOptions.FocusCars)} level='h4'>
                    <Counter
                        from={previousTransportPercentageChange}
                        to={transportPercentageChange}
                        prefix={Math.sign(transportPercentageChange) >= 0 ? "+" : ""}
                        suffix="% 🚊"
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
                <Typography sx={{ color: "#646B73" }} level="body-xs">*since {startYear}</Typography>
            </Stack>
            <Divider orientation="vertical" />
            <Typography level='h4'>{endYear}</Typography>
        </>
    );
};

export default KeyMetricsTS;