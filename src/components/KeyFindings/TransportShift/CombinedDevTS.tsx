import { Select, Option, Stack, Typography, Badge, Card, CardOverflow, Divider, CardContent } from "@mui/joy";
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData as CarYearlyData } from '../../../data/carDataInterface';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import GroupedBarChartLegend from "./GroupedBarChartLegend";
import Tooltip from "./Tooltip";
import { FilterOptions } from "./TransportShift";

export enum ChartSorting {
    None, SortPublicTransport, SortCars
}

interface Props {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    endYear: string;
    currentFilter: FilterOptions;
}

const CombinedDevTS: React.FC<Props> = ({ carData, transportData, endYear, currentFilter }) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedCarMetric, setSelectedCarMetric] = useState<keyof CarData>('passenger_km');
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passenger_km');
    const d3Container = useRef<SVGSVGElement | null>(null);

    const [currentSorting, setCurrentSorting] = useState<ChartSorting>(ChartSorting.None);
    var color = d3.scaleOrdinal().range(["grey", "grey"]); // Car, PT

    switch (currentFilter) {
        case FilterOptions.Comparison:
            if (currentSorting != ChartSorting.None) {
                setCurrentSorting(ChartSorting.None);
            }
            color = d3.scaleOrdinal().range(["rgba(60, 27, 24, 0.5)", "#03045E"]); // Car, PT
            break;
        case FilterOptions.FocusPublicTransport:
            if (currentSorting != ChartSorting.SortPublicTransport) {
                setCurrentSorting(ChartSorting.SortPublicTransport);
            }
            color = d3.scaleOrdinal().range(["#E8E8E8", "#03045E"]); // Car, PT
            break;
        case FilterOptions.FocusCars:
            if (currentSorting != ChartSorting.SortCars) {
                setCurrentSorting(ChartSorting.SortCars);
            }
            color = d3.scaleOrdinal().range(["rgba(60, 27, 24, 0.5)", "#E8E8E8"]); // Car, PT
            break;
        default:
            color = d3.scaleOrdinal().range(["rgba(60, 27, 24, 0.5)", "#03045E"]); // Car, PT
            console.log(`Got ${currentFilter} but expected Comparison, FocusPublicTransport or FocusCars`);
    }


    // Tooltip
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipState, setTooltipState] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const GERMAN_STATES = {
        'BW': 'Baden-Württemberg',
        'BY': 'Bavaria',
        'BE': 'Berlin',
        'BB': 'Brandenburg',
        'HB': 'Bremen',
        'HH': 'Hamburg',
        'HE': 'Hesse',
        'MV': 'Mecklenburg-Vorpommern',
        'NI': 'Lower-Saxony',
        'NW': 'North Rhine-Westphalia',
        'RP': 'Rhineland-Palatinate',
        'SL': 'Saarland',
        'SN': 'Saxony',
        'ST': 'Saxony-Anhalt',
        'SH': 'Schleswig-Holstein',
        'TH': 'Thuringia'
    };

    const calculatePercentageChange = (data: CarYearlyData | TransportYearlyData, state: string, metric: keyof CarData | keyof TransportData) => {
        const startYearData = data[startYear].find(d => d.state === state);
        const endYearData = data[endYear].find(d => d.state === state);

        if (!startYearData || !endYearData) {
            return 0;
        }
        // @ts-ignore
        const startValue = startYearData[metric];
        // @ts-ignore
        const endValue = endYearData[metric];

        if (typeof startValue === 'number' && typeof endValue === 'number') {
            return ((endValue - startValue) / startValue) * 100;
        } else {
            return 0;
        }
    };

    // Store the original fill color before applying hover pattern
    const storeOriginalColor = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        const originalColor = d3.select(event.currentTarget).style('fill') ?? 'initial';
        event.currentTarget.setAttribute('data-original-color', originalColor);
    };

    // Handling the mouse hover for bars
    const handleMouseOverBar = (event: React.MouseEvent<SVGRectElement, MouseEvent>, d: any, dataset: 'carData' | 'transportData') => {
        const isPT = dataset === 'transportData' ? true : false;

        const [x, y] = d3.pointer(event);
        // @ts-ignore
        const stateFullName = GERMAN_STATES[d.state] || d.state; // Use full name if available, else use the abbreviation

        setTooltipState(stateFullName);
        setTooltipPosition({ x, y });
        setTooltipContent(`${isPT ? '🚈' : '🚗'} ${isPT ? d.transportChange.toFixed(2) : d.carChange.toFixed(2)}% change`);
        setTooltipVisible(true);

        d3.select(event.currentTarget).style('fill', 'url(#stripes-pattern)');
    };

    // Handling the mouse exit for bars
    const handleMouseOutBar = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        setTooltipVisible(false);
        // Restore the original fill color
        const originalColor = event.currentTarget.getAttribute('data-original-color');
        // @ts-ignore
        d3.select(event.currentTarget).style('fill', originalColor);

        event.currentTarget.removeAttribute('data-original-color');
    };


    // @ts-ignore
    useEffect(() => {
        if (carData && transportData && d3Container.current) {
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 5, right: 30, bottom: 10, left: 30 };
            const width = 800 - margin.left - margin.right;
            const height = 250 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Gather unique states from both datasets
            let allStates = new Set<string>();
            [carData, transportData].forEach(dataset => {
                Object.values(dataset).flat().forEach(entry => {
                    if (entry.state !== "FEDERAL") {
                        allStates.add(entry.state);
                    }
                });
            });

            let combinedPercentageChanges = Array.from(allStates).map(state => {
                const carChange = calculatePercentageChange(carData, state, selectedCarMetric);
                const transportChange = calculatePercentageChange(transportData, state, selectedTransportMetric);

                console.log(carChange, transportChange);

                return {
                    state,
                    carChange,
                    transportChange,
                    averageChange: (carChange + transportChange) / 2
                };
            });

            // Filter out 'federal' data
            combinedPercentageChanges = combinedPercentageChanges.filter(d => d.state !== 'FEDERAL');

            // Sorting logic
            let sortedData = combinedPercentageChanges;

            switch (currentSorting) {
                case ChartSorting.SortPublicTransport:
                    sortedData = combinedPercentageChanges.sort((a, b) => b.transportChange - a.transportChange);
                    break;
                case ChartSorting.SortCars:
                    sortedData = combinedPercentageChanges.sort((a, b) => b.carChange - a.carChange);
                    break;
                default:
                    // No sorting or default sorting logic
                    break;
            }

            // Define x0 and x1 scales with the sorted data
            const x0Sorted = d3.scaleBand()
                .range([0, width])
                .paddingInner(0.1)
                .domain(sortedData.map(d => d.state));

            const x1Sorted = d3.scaleBand()
                .padding(0.05)
                .domain(['transportData', 'carData'])
                .rangeRound([0, x0Sorted.bandwidth()]);

            // Find the maximum absolute percentage change for both datasets
            const maxCarChange = d3.max(combinedPercentageChanges, d => Math.abs(d.carChange)) as number;
            const maxTransportChange = d3.max(combinedPercentageChanges, d => Math.abs(d.transportChange)) as number;
            const maxChange = Math.max(maxCarChange, maxTransportChange);

            // Define y-scales with fixed domain extent
            const yCar = d3.scaleLinear()
                .range([height, 0])
                .domain([-50, 50])
                .nice();

            const yTransport = d3.scaleLinear()
                .range([height, 0])
                .domain([-50, 50])
                .nice();

            // Create the axes
            const yAxisLeft = d3.axisLeft(yCar);
            const yAxisRight = d3.axisRight(yTransport);

            // Append the axes to the SVG
            svg.append("g")
                .attr("class", "y axis left")
                .call(yAxisLeft)
                .selectAll("text") // Selecting all text elements within the axis
                .style("font-size", "11px"); // Set the font size

            // Draw horizontal lines at specified values
            const referenceLines = [-40, -20, 20, 40];

            svg.selectAll(".reference-line")
                .data(referenceLines)
                .enter().append("line")
                .attr("class", "reference-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => yCar(d))
                .attr("y2", d => yCar(d))
                .attr("stroke", "#ddd") // Light grey color
                .attr("stroke-width", 2.5)
                .attr("stroke-dasharray", "3,3"); // Dashed line style

            // Append the axes to the SVG
            svg.append("g")
                .attr("class", "y axis left")
                .call(yAxisLeft)
                .selectAll("text") // Selecting all text elements within the axis
                .style("font-size", "11px"); // Set the font size

            // Draw the bars for CarData
            svg.selectAll(".bar.car")
                .data(sortedData)
                .enter().append("rect")
                .attr("class", "bar car")
                // @ts-ignore
                .attr("x", d => x0Sorted(d.state))
                .attr("width", x1Sorted.bandwidth())
                .attr("y", d => yCar(Math.max(0, d.carChange)))
                .attr("height", d => Math.abs(yCar(d.carChange) - yCar(0)))
                // @ts-ignore
                .attr("fill", color('carData'))
                .on("mouseover", (event, d) => {
                    storeOriginalColor(event);
                    handleMouseOverBar(event, d, 'carData');
                })
                .on("mouseout", handleMouseOutBar);

            // Draw the bars for TransportData
            svg.selectAll(".bar.transport")
                .data(sortedData)
                .enter().append("rect")
                .attr("class", "bar transport")
                // @ts-ignore
                .attr("x", d => x0Sorted(d.state) + x1Sorted.bandwidth())
                .attr("width", x1Sorted.bandwidth())
                .attr("y", d => yTransport(Math.max(0, d.transportChange)))
                .attr("height", d => Math.abs(yTransport(d.transportChange) - yTransport(0)))
                // @ts-ignore
                .attr("fill", color('transportData'))
                .on("mouseover", (event, d) => {
                    storeOriginalColor(event);
                    handleMouseOverBar(event, d, 'transportData');
                })
                .on("mouseout", handleMouseOutBar);

            // Add the x-axis using the sorted x0 scale
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${yCar(0)})`)
                .call(d3.axisBottom(x0Sorted));
        }
    }, [carData, transportData, startYear, endYear, selectedCarMetric, selectedTransportMetric, currentSorting]);


    return (
        <div>
            {/*
            <Stack direction={"row"}>
                <Stack gap={"5px"} ml={3}>
                    <Stack direction={"row"} gap={"5px"}>
                        <Typography pt={"5px"}>Car Dataset:</Typography>
                        // @ts-ignore
                        <Badge color="cars">
                            <Select defaultValue="passenger_km" sx={{ minWidth: "250px", maxHeight: "30px", marginLeft: "10px" }}>
                                <Option value="passenger_km" onClick={() => setSelectedCarMetric('passenger_km')}>Total Passenger KMs</Option>
                                <Option value="per_car_km" onClick={() => setSelectedCarMetric('per_car_km')}>Per Car Km</Option>
                                <Option value="per_car_pass_km" onClick={() => setSelectedCarMetric('per_car_pass_km')}>Per Car Passenger Km</Option>
                                <Option value="cars" onClick={() => setSelectedCarMetric('cars')}>Number of Cars</Option>
                            </Select>
                        </Badge>
                    </Stack>
                    <Stack direction={"row"} gap={"5px"}>
                        <Typography pt={"5px"}>Public Transport Dataset:</Typography>
                        // @ts-ignore
                        <Badge color="pT">
                            <Select defaultValue="total_local_passenger_km" sx={{ minWidth: "250px", maxHeight: "30px", marginLeft: "10px" }}>
                                <Option value="total_local_passengers" onClick={() => setSelectedTransportMetric('total_local_passengers')}>Total Local Passengers</Option>
                                <Option value="total_local_passenger_km" onClick={() => setSelectedTransportMetric('total_local_passenger_km')}>Total Local Passenger Km</Option>
                            </Select>
                        </Badge>
                    </Stack>
                </Stack>
            </Stack>
            */}
            <svg ref={d3Container} />
            {tooltipVisible && (<Tooltip tooltipPosition={tooltipPosition} tooltipState={tooltipState} tooltipContent={tooltipContent}></Tooltip>)}
        </div>
    );
};

export default CombinedDevTS;
