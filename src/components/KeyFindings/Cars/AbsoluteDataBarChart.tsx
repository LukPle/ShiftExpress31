import { Select, Option, Stack, Button, Typography, Badge } from "@mui/joy";
import { Sort, Calculate } from '@mui/icons-material';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData as CarYearlyData } from '../../../data/carDataInterface';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import { PopulationData, YearlyData as PopulationYearlyData } from '@/data/populationInterface';
import { FilterOptions } from './Cars';
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
}

const AbsoluteDataBarChart: React.FC<Props> = ({ carData, transportData, populationData, currentFilter }) => {
    const [selectedYear, setSelectedYear] = useState<string>('2013');
    const [selectedCarMetric, setSelectedCarMetric] = useState<keyof CarData>('passenger_km');
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passengers');
    const [sortByPopulation, setSortByPopulation] = useState<boolean>(false);
    const [inRelationToPopulation, setInRelationToPopulation] = useState<boolean>(false);
    const d3Container = useRef<SVGSVGElement | null>(null);

    var color = d3.scaleOrdinal().range(["grey", "grey"]); // Car, PT

    switch (currentFilter) {
        case FilterOptions.CarsAbs:
            color = d3.scaleOrdinal().range(["#9BC4FD", "#E8E8E8"]); // Car, PT
            break;
        case FilterOptions.Comparison:
            color = d3.scaleOrdinal().range(["#9BC4FD", "#FFA500"]); // Car, PT
            break;
        default:
            break;
    }

    useEffect(() => {
        if (d3Container.current) {
            // Clear the existing SVG content
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 80, bottom: 40, left: 90 };
            const width = 820 - margin.left - margin.right;
            const height = 270 - margin.top - margin.bottom;

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
                    .attr("x",(d: { key: string; value: number; }) => String(x1(d.key)))
                    .attr("y", d => yRight(d.value))
                    .attr("width", x1.bandwidth())
                    .attr("height", d => height - yRight(d.value))
                    .attr("fill", color('transportData') as string); //Please review

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
    }, [carData, transportData, selectedYear, selectedCarMetric, selectedTransportMetric, sortByPopulation, inRelationToPopulation, populationData, color]);

    return (
        <div>
            <svg ref={d3Container} />
        </div>
    );
};

export default AbsoluteDataBarChart;
