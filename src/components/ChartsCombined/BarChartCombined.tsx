import { Select, Option, Stack, Button, Typography, Badge } from "@mui/joy";
import { Sort, Calculate } from '@mui/icons-material';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData as CarYearlyData } from '../../data/carDataInterface';
import { TransportData, YearlyData as TransportYearlyData } from '../../data/pTDataInterface';
import { PopulationData } from '@/data/populationInterface';

interface CombinedData {
    state: string;
    carValue: number;
    transportValue: number;
}

interface Props {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    populationData: PopulationData[];
}

const CombinedVisualization: React.FC<Props> = ({ carData, transportData, populationData }) => {
    const [selectedYear, setSelectedYear] = useState<string>('2013');
    const [selectedCarMetric, setSelectedCarMetric] = useState<keyof CarData>('passenger_km');
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passengers');
    const [sortByPopulation, setSortByPopulation] = useState<boolean>(false);
    const [inRelationToPopulation, setInRelationToPopulation] = useState<boolean>(false);
    const d3Container = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (d3Container.current) {
            // Clear the existing SVG content
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 80, bottom: 40, left: 90 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

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
                .rangeRound([height, 0]);

            const yRight = d3.scaleLinear()
                .rangeRound([height, 0]);

            const color = d3.scaleOrdinal().range(["#1f77b4", "#ff7f0e"]);

            // Function to update the chart
            const updateChart = () => {
                // Combine car and transport data for the given year and state
                let combinedData: CombinedData[] = populationData.map(p => {
                    const carDatum = carData[selectedYear].find(d => d.state === p.state) || { [selectedCarMetric]: 0 };
                    const transportDatum = transportData[selectedYear].find(d => d.state === p.state) || { [selectedTransportMetric]: 0 };
                    return {
                        state: p.state,
                        carValue: carDatum[selectedCarMetric] as number,
                        transportValue: transportDatum[selectedTransportMetric] as number,
                    };
                });

                // Apply sorting and relation to population if needed
                if (sortByPopulation) {
                    const populationMap = new Map(populationData.map(d => [d.state, d.population]));
                    combinedData.sort((a, b) => (populationMap.get(b.state) || 0) - (populationMap.get(a.state) || 0));
                }

                if (inRelationToPopulation) {
                    const populationMap = new Map(populationData.map(d => [d.state, d.population]));
                    combinedData.forEach(d => {
                        const population = populationMap.get(d.state) || 1;
                        d.carValue = d.carValue / population;
                        d.transportValue = d.transportValue / population;
                    });
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
                    .attr("x", d => x1(d.key))
                    .attr("y", d => yLeft(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yLeft(d.value))
                    .attr("fill", color('carData'));

                stateGroups.selectAll(".bar.transport")
                    .data(d => [{ key: 'transportData', value: d.transportValue }])
                    .enter().append("rect")
                    .attr("class", "bar transport")
                    .attr("x", d => x1(d.key))
                    .attr("y", d => yRight(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yRight(d.value))
                    .attr("fill", color('transportData'));

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x0));

                svg.append("g")
                    .attr("class", "y-axis-left")
                    .call(d3.axisLeft(yLeft));

                svg.append("g")
                    .attr("class", "y-axis-right")
                    .attr("transform", `translate(${width},0)`)
                    .call(d3.axisRight(yRight));
            };

            // Initial chart render
            updateChart();
        }
    }, [carData, transportData, selectedYear, selectedCarMetric, selectedTransportMetric, sortByPopulation, inRelationToPopulation, populationData]);

    return (
        <div>
            <Stack direction={"row"} spacing={2}>
            <Select defaultValue="2013" sx={{ maxWidth: "100px", maxHeight: "30px" }}>
                    <Option value="2013" onClick={() => setSelectedYear('2013')}>2013</Option>
                    <Option value="2014" onClick={() => setSelectedYear('2014')}>2014</Option>
                    <Option value="2015" onClick={() => setSelectedYear('2015')}>2015</Option>
                    <Option value="2016" onClick={() => setSelectedYear('2016')}>2016</Option>
                    <Option value="2017" onClick={() => setSelectedYear('2017')}>2017</Option>
                    <Option value="2018" onClick={() => setSelectedYear('2018')}>2018</Option>
                    <Option value="2019" onClick={() => setSelectedYear('2019')}>2019</Option>
                    <Option value="2020" onClick={() => setSelectedYear('2020')}>2020</Option>
                    <Option value="2021" onClick={() => setSelectedYear('2021')}>2021</Option>
                    <Option value="2022" onClick={() => setSelectedYear('2022')}>2022</Option>
                </Select>
                <Stack gap={"5px"} ml={3}>
                    <Stack direction={"row"} gap={"5px"}>
                        <Typography pt={"5px"}>Car Dataset:</Typography>
                        {/* @ts-ignore */}
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
                        {/* @ts-ignore */}
                        <Badge color="pT">
                            <Select defaultValue="total_local_passengers" sx={{ minWidth: "250px", maxHeight: "30px", marginLeft: "10px" }}>
                                <Option value="total_local_passengers" onClick={() => setSelectedTransportMetric('total_local_passengers')}>Total Local Passengers</Option>
                                <Option value="total_local_passenger_km" onClick={() => setSelectedTransportMetric('total_local_passenger_km')}>Total Local Passenger Km</Option>
                            </Select>
                        </Badge>
                    </Stack>
                </Stack>
            </Stack>
            <svg ref={d3Container} />
            <Stack direction={"row"}>
                <Button onClick={() => setSortByPopulation(!sortByPopulation)} startDecorator={<Sort />}>
                    {sortByPopulation ? 'Default Sort' : 'Sort by Population'}
                </Button>
                <Button onClick={() => setInRelationToPopulation(!inRelationToPopulation)} sx={{ marginLeft: "10px" }} startDecorator={<Calculate />}>
                    {inRelationToPopulation ? 'Show Absolute Values' : 'Show Values in Relation to Population'}
                </Button>
            </Stack>
        </div>
    );
};

export default CombinedVisualization;
