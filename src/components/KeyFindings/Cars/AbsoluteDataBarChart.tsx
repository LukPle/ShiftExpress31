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
}

const ptColor = "#9BC4FD";
const carColor = '#FFA500';
const unfocusedColor = '#E8E8E8';

const getRectangleStyle = (color: string): React.CSSProperties => {
    return {
        width: '30px',
        height: '20px',
        backgroundColor: color,
        borderRadius: '10%',
        marginRight: '10px',
        border: '1px solid #BFBFBF',
    };
};

const AbsoluteDataBarChart: React.FC<Props> = ({ carData, transportData, populationData, currentFilter, selectedYear }) => {
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

    useEffect(() => {
        if (d3Container.current) {
            // Clear the existing SVG content
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 15, right: 75, bottom: 20, left: 80 };
            const width = 820 - margin.left - margin.right;
            const height = 235 - margin.top - margin.bottom;

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
                    .data(d => [{ key: 'carData', value: d.carValue }])
                    .enter().append("rect")
                    .attr("class", "bar car")
                    .attr("x", (d: { key: string; value: number; }) => String(x1(d.key)))
                    .attr("y", d => yLeft(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yLeft(d.value))
                    .attr("fill", color('carData') as string);

                stateGroups.selectAll(".bar.transport")
                    .data(d => [{ key: 'transportData', value: d.transportValue }])
                    .enter().append("rect")
                    .attr("class", "bar transport")
                    .attr("x", (d: { key: string; value: number; }) => String(x1(d.key)))
                    .attr("y", d => yRight(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yRight(d.value))
                    .attr("fill", color('transportData') as string); //Please review

                const yAxisLeft = d3.axisLeft(yLeft).tickFormat((d) => formatLargeNumber(String(d))).ticks(5);
                const yAxisRight = d3.axisRight(yRight).tickFormat((d) => formatLargeNumber(String(d))).ticks(5);

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
                    .style("font-weight", "300");
            };

            // Initial chart render
            updateChart();
        }
    }, [carData, transportData, selectedYear, selectedCarMetric, selectedTransportMetric, sortByPopulation, inRelationToPopulation, populationData, color]);

    return (
        <div>
            {currentFilter === FilterOptions.CarsDev ? (
                <>
                    <Card>
                    <Stack alignItems={"center"}>
                        <CombinedDevTS carData={carData} transportData={transportData} endYear={selectedYear} currentFilter={FilterOptionsTS.FocusCars} />
                    </Stack>
                        <CardOverflow>
                            <Divider inset="context" />
                            <CardContent orientation="horizontal">
                                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                                    <Typography startDecorator={<InteractionTooltip tooltipText={`Explore detailed usage changes by hovering a state.`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Percentual change of usage from 2013 to {selectedYear} across each federal state</Typography>
                                </Stack>
                                <Divider orientation="vertical" />
                                <MiniLegend currentOption={currentFilter} />
                            </CardContent>
                        </CardOverflow>
                    </Card>
                </>
            ) : (
                <Card>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Stack direction={"row"}><div style={getRectangleStyle(carColor)}></div><Typography>🚗</Typography>            <Divider orientation="vertical" sx={{ mx: 2 }} />
                        </Stack>
                        <Stack direction={"row"}>            <Divider orientation="vertical" sx={{ mx: 2 }} />
                            <div style={getRectangleStyle(currentFilter === FilterOptions.Comparison ? ptColor : unfocusedColor)}></div><Typography>🚊</Typography></Stack>
                    </Stack>
                    <Stack alignItems={"center"}>
                        <svg ref={d3Container} />
                    </Stack>
                    <CardOverflow>
                        <Divider inset="context" />
                        <CardContent orientation="horizontal">
                            <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                                <Typography startDecorator={<InteractionTooltip tooltipText={`Hover over the states to get more details about the change of usage`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Total passenger kms per state in {selectedYear}.</Typography>
                            </Stack>
                            <Divider orientation="vertical" />
                            <Button variant="outlined" onClick={() => setInRelationToPopulation(!inRelationToPopulation)} sx={{ marginTop: "-5px", marginBottom: "-5px" }} startDecorator={<Calculate />}>
                                {inRelationToPopulation ? 'Show Absolute Values' : 'Show Values in Relation to Population'}
                            </Button>
                        </CardContent>
                    </CardOverflow>
                </Card>
            )
            }
        </div>
    );
};

export default AbsoluteDataBarChart;
