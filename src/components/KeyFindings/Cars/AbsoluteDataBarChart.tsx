import { Stack, Button, Typography, CardOverflow, CardContent, Divider, Card } from "@mui/joy";
import { Sort, Calculate, InfoOutlined } from '@mui/icons-material';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData as CarYearlyData } from '../../../data/carDataInterface';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import { PopulationData, YearlyData as PopulationYearlyData } from '@/data/populationInterface';
import { FilterOptions } from './Cars';
import { FilterOptions as FilterOptionsTS } from '../TransportShift/TransportShift';
import CombinedDevTS from "../TransportShift/CombinedDevTS";
import MiniLegend from '../ChartLegendsAndTooltip/MiniLegend';
import InteractionTooltip from "@/components/InteractionTooltip";
import MetricView from "../ChartLegendsAndTooltip/MetricView";
import ChartTooltip from "@/components/KeyFindings/ChartLegendsAndTooltip/ChartTooltip";

interface CombinedData {
    state: string;
    carValue: number;
    transportValue: number;
}

interface Props {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    populationData: PopulationYearlyData;
    currentFilter: FilterOptions;
    selectedYear: string;
    onStateHover: (stateId: string | null) => void;
    selectedState: string | null;
}

const ptColor = "#9BC4FD";
const carColor = '#FFA500';
const unfocusedColor = '#E8E8E8';

const AbsoluteDataBarChart: React.FC<Props> = ({ carData, transportData, populationData, currentFilter, selectedYear, onStateHover, selectedState }) => {
    const [selectedCarMetric, setSelectedCarMetric] = useState<keyof CarData>('passenger_km');
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passenger_km');
    const [sortByPopulation, setSortByPopulation] = useState<boolean>(false);
    const [inRelationToPopulation, setInRelationToPopulation] = useState<boolean>(false);
    const d3Container = useRef<SVGSVGElement | null>(null);

    var color = d3.scaleOrdinal().range(["grey", "grey"]); // Car, PT

    switch (currentFilter) {
        case FilterOptions.CarsAbs:
            color = d3.scaleOrdinal().range(["#FFA500", "#E8E8E8"]); // Car, PT
            break;
        case FilterOptions.Comparison:
            color = d3.scaleOrdinal().range(["#FFA500", "#9BC4FD"]); // Car, PT
            break;
        default:
            break;
    }

    const formatLargeNumber = (numStr: string): string => {
        const num = parseFloat(numStr);
        if (num >= 1e12) {
            return (num / 1e12).toFixed(2) + ' tri';
        }
        else if (num >= 1e9) { return (num / 1e9).toFixed(2) + ' bil'; }
        else if (num >= 1e6) { return (num / 1e6).toFixed(2) + ' mil'; }
        else if (num >= 1e3) { return (num / 1e3).toFixed(2) + ' thsd'; }
        else { return num.toString(); }
    };

    // Tooltip State Management
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipState, setTooltipState] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // GERMAN_STATES Map
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
    // Mouse Event Handlers
    const handleMouseOverBar = (event: React.MouseEvent<SVGRectElement, MouseEvent>, d: any, dataset: 'carData' | 'transportData') => {
        const [x, y] = d3.pointer(event);
        // @ts-ignore
        const stateCode = d.state; // ('NW', 'BY', usw.)
        // @ts-ignore
        const stateFullName = GERMAN_STATES[stateCode] || stateCode;


        const offset = 60; // Adjust this value to move the tooltip up by desired amount
        const adjustedY = y - offset; // Shift the tooltip up

        setTooltipState(stateFullName);
        // @ts-ignore
        setTooltipPosition({ x: (event.layerX), y: adjustedY });
        setTooltipContent(`${dataset === 'carData' ? '🚗' : '🚈'} ${formatLargeNumber(d.value)} `);
        setTooltipVisible(true);

        onStateHover(d.state);

    };

    const handleMouseOutBar = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        setTooltipVisible(false);
        const originalColor = event.currentTarget.getAttribute('data-original-color');
        // @ts-ignore
        d3.select(event.currentTarget).style('fill', originalColor);
        event.currentTarget.removeAttribute('data-original-color');
        onStateHover(null);
    };


    useEffect(() => {
        if (d3Container.current) {
            // Clear the existing SVG content
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 15, right: 75, bottom: 20, left: 80 };
            const width = 820 - margin.left - margin.right;
            const height = 240 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x0 = d3.scaleBand()
                .rangeRound([0, width])
                .paddingInner(0.1);

            const x1 = d3.scaleBand()
                .padding(0.05);

            const yLeft = d3.scaleLinear()
                .rangeRound([height, 0])

            const yRight = d3.scaleLinear()
                .rangeRound([height, 0]);

            // Function to update the chart
            const updateChart = () => {
                // Combine car and transport data for the given year and state
                let combinedData: CombinedData[] = populationData[selectedYear].map(p => {
                    const carDatum = carData[selectedYear].find(d => d.state === p.state) || { [selectedCarMetric]: 0 };
                    const transportDatum = transportData[selectedYear].find(d => d.state === p.state) || { [selectedTransportMetric]: 0 };
                    return {
                        state: p.state,
                        carValue: carDatum[selectedCarMetric] as number,
                        transportValue: transportDatum[selectedTransportMetric] as number,
                    };
                });

                // Sort by car value
                combinedData.sort((a, b) => b.carValue - a.carValue);

                // Apply sorting and relation to population if needed
                if (sortByPopulation) {
                    const populationMap = new Map(populationData[selectedYear].map(d => [d.state, d.population]));
                    combinedData.sort((a, b) => (populationMap.get(b.state) || 0) - (populationMap.get(a.state) || 0));
                }

                if (inRelationToPopulation) {
                    const populationMap = new Map(populationData[selectedYear].map(d => [d.state, d.population]));
                    combinedData.forEach(d => {
                        const population = populationMap.get(d.state) || 1;
                        d.carValue = d.carValue / population;
                        d.transportValue = d.transportValue / population;
                    });
                    combinedData.sort((a, b) => b.carValue - a.carValue);
                }

                x0.domain(combinedData.map(d => d.state));
                x1.domain(['carData', 'transportData']).rangeRound([0, x0.bandwidth()]);
                // @ts-ignore
                yLeft.domain([0, d3.max(combinedData, d => d.carValue)]);
                // @ts-ignore
                yRight.domain([0, d3.max(combinedData, d => d.transportValue)]);

                svg.selectAll(".bar").remove();

                const stateGroups = svg.selectAll(".state-group")
                    .data(combinedData)
                    .enter().append("g")
                    .attr("class", "state-group")
                    .attr("transform", d => `translate(${x0(d.state)}, 0)`);


                stateGroups.selectAll(".bar.car")
                    .data(d => [{ key: 'carData', value: d.carValue, state: d.state}])
                    .enter().append("rect")
                    .attr("class", "bar car")
                    .attr("x", (d: { key: string; value: number; }) => String(x1(d.key)))
                    .attr("y", d => yLeft(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yLeft(d.value))
                    .attr("fill", color('carData') as string)
                    .attr("opacity", d =>
                        currentFilter === FilterOptions.Comparison || currentFilter === FilterOptions.CarsAbs ?
                            (selectedState === null || selectedState === d.state ? 1 : 0.3) : 1)
                    .on("mouseover", (event, d) => handleMouseOverBar(event, d, 'carData'))
                    .on("mouseout",handleMouseOutBar);

                stateGroups.selectAll(".bar.transport")
                    .data(d => [{ key: 'transportData', value: d.transportValue , state: d.state}])
                    .enter().append("rect")
                    .attr("class", "bar transport")
                    .attr("x", (d: { key: string; value: number; }) => String(x1(d.key)))
                    .attr("y", d => yRight(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yRight(d.value))
                    .attr("fill", color('transportData') as string)
                    .attr("opacity", d =>
                        currentFilter === FilterOptions.Comparison || currentFilter === FilterOptions.CarsAbs ?
                            (selectedState === null || selectedState === d.state ? 1 : 0.3) : 1)
                    .on("mouseover", (event, d) => handleMouseOverBar(event, d, 'transportData'))
                    .on("mouseout", handleMouseOutBar);

                const yAxisLeft = d3.axisLeft(yLeft).tickFormat((d) => formatLargeNumber(String(d))).ticks(5);
                const yAxisRight = d3.axisRight(yRight).tickFormat((d) => formatLargeNumber(String(d))).ticks(5);
                const yAxisRightColor = currentFilter === FilterOptions.CarsAbs ? unfocusedColor : 'black';

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x0))
                    .selectAll('text')
                    .style('font-size', '15px')
                    .style("font-weight", "600");

                svg.append("g")
                    .attr("class", "y-axis-left")
                    .call(yAxisLeft)
                    .selectAll('text')
                    .style('font-size', '15px')
                    .style("font-weight", "300");

                svg.append("g")
                    .attr("class", "y-axis-right")
                    .attr("transform", `translate(${width},0)`)
                    .call(yAxisRight)
                    .selectAll('text')
                    .style('font-size', '15px')
                    .style("font-weight", "300")
                    .attr('fill', yAxisRightColor);
                
                // Adjust both axis line and ticks color dynamically
                svg.selectAll('.y-axis-right .tick line')
                    .attr('stroke', yAxisRightColor);
                
                svg.selectAll('.y-axis-right path')
                    .style('stroke', yAxisRightColor);
            };

            // Initial chart render
            updateChart();
        }
    }, [carData, transportData, selectedCarMetric, selectedTransportMetric, selectedState, currentFilter, inRelationToPopulation, selectedYear]);

    return (
        <div>
            {currentFilter === FilterOptions.CarsDev ? (
                <>
                    <Card>
                    <Stack alignItems={"center"}>
                        <CombinedDevTS carData={carData} transportData={transportData} endYear={selectedYear} currentFilter={FilterOptionsTS.FocusCars} selectedState={selectedState} onStateHover={onStateHover}/>
                    </Stack>
                        <CardOverflow>
                            <Divider inset="context" />
                            <CardContent orientation="horizontal">
                                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                                    <Typography startDecorator={<InteractionTooltip tooltipText={`Explore detailed usage changes by hovering a state.`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Change from 2013 to {selectedYear} in %</Typography>
                                </Stack>
                                <Divider orientation="vertical" />
                                <MiniLegend currentOption={FilterOptionsTS.FocusCars} carText='🚗 passenger kms per state' ptText='🚊 passenger kms per state'/>
                            </CardContent>
                        </CardOverflow>
                    </Card>
                </>
            ) : (
                <Card>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Stack direction={"row"}>
                            <MetricView color={carColor} text={'🚗 passenger kms per state'} isPT={false} opacity={1}/>
                        </Stack>
                        <Stack direction={"row"}>
                            <MetricView color={currentFilter === FilterOptions.Comparison ? ptColor : unfocusedColor} text={'🚊 passenger kms per state'} isPT={true} opacity={currentFilter === FilterOptions.Comparison ? 1 : 0.5}/>
                        </Stack>
                    </Stack>
                    <Stack alignItems={"center"}>
                    <svg ref={d3Container} />
                    {tooltipVisible && (
                        <ChartTooltip
                            tooltipPosition={tooltipPosition}
                            tooltipState={tooltipState}
                            tooltipContent={tooltipContent}
                        />
                    )}
                    </Stack>
                    <CardOverflow>
                        <Divider inset="context" />
                        <CardContent orientation="horizontal">
                            <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                                <Typography startDecorator={<InteractionTooltip tooltipText='Explore detailed usage changes by hovering over a state' delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Total passenger km per state in {selectedYear}</Typography>
                            </Stack>
                            <Divider orientation="vertical" />
                            <Button variant="outlined" onClick={() => setInRelationToPopulation(!inRelationToPopulation)} sx={{ marginTop: "-5px", marginBottom: "-5px" }} startDecorator={<Calculate />}>
                                {inRelationToPopulation ? 'Show Total Values' : 'Show Values in Relation to Population'}
                            </Button>
                        </CardContent>
                    </CardOverflow>
                </Card>
            )
            }
            {/* Rendering der Tooltip-Komponente */}

        </div>
    );
};

export default AbsoluteDataBarChart;
