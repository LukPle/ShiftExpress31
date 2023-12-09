// TransportDataVisualization.tsx
import { Select, Option } from "@mui/joy";
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData } from '../../data/carDataInterface';

interface Props {
    data: YearlyData;
}

const CarDataVisualization: React.FC<Props> = ({ data }) => {
    const [selectedMetric, setSelectedMetric] = useState<keyof CarData>('passenger_km');
    const d3Container = useRef<SVGSVGElement | null>(null);

    // Data transformation
    const transformData = (data: YearlyData, metric: keyof CarData): { state: string; values: { year: string; value: number; }[] }[] => {
        const states = new Set<string>();
        Object.values(data).forEach(yearData => yearData.forEach(d => {
            if (d.state !== 'FEDERAL') {
                states.add(d.state);
            }
        }));

        const seriesData: { state: string; values: { year: string; value: number; }[] }[] = [];
        states.forEach(state => {
            const stateData = { state, values: [] as { year: string; value: number; }[] };
            for (const year in data) {
                const yearDatum = data[year].find(d => d.state === state);
                if (yearDatum) {
                    const value = yearDatum[metric];
                    // Ensuring value is treated as a number
                    if (typeof value === 'number') {
                        stateData.values.push({ year, value });
                    }
                }
            }
            seriesData.push(stateData);
        });
        return seriesData;
    };


    useEffect(() => {
        if (data && d3Container.current) {
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 80, bottom: 30, left: 90 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scalePoint()
                .range([0, width])
                .domain(Object.keys(data).sort());

            // Correcting the domain calculation
            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(Object.values(data).flat(), d => {
                    const value = d[selectedMetric];
                    return typeof value === 'number' ? value : undefined;
                }) as number]); // Ensuring the accessor always returns a number or undefined

            const color = d3.scaleOrdinal(d3.schemeCategory10); // Using a D3 color scheme

            const line = d3.line<{ year: string; value: number }>()
                .x(d => x(d.year) as number)
                .y(d => y(d.value));

                const series = transformData(data, selectedMetric);

            // Find the new maximum value for the y-axis domain after filtering 'federal'
            const maxPassengers = d3.max(series.flatMap(s => s.values), d => d.value) ?? 0; // Use nullish coalescing to default to 0

            y.domain([0, maxPassengers]);

            series.forEach(s => {
                const path = svg.append("path")
                    .datum(s.values)
                    .attr("fill", "none")
                    .attr("stroke", () => color(s.state))
                    .attr("stroke-width", 1.5)
                    .attr("d", line);

                // Add labels
                svg.append("text")
                    .attr("transform", `translate(${width},${y(s.values[s.values.length - 1].value)})`)
                    .attr("dy", ".35em")
                    .attr("dx", ".35em")
                    .attr("text-anchor", "start")
                    .style("fill", color(s.state))
                    .text(s.state);
            });

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));
        }
    }, [data, selectedMetric]);

    return (
        <div>
            <Select defaultValue="passenger_km" sx={{ maxWidth: "250px" }}>
                    <Option value="passenger_km" onClick={() => setSelectedMetric('passenger_km')}>Total Passenger KMs</Option>
                    <Option value="per_car_km" onClick={() => setSelectedMetric('per_car_km')}>Per Car Km</Option>
                    <Option value="per_car_pass_km" onClick={() => setSelectedMetric('per_car_pass_km')}>Per Car Passenger Km</Option>
                    <Option value="cars" onClick={() => setSelectedMetric('cars')}>Number of Cars</Option>
                </Select>
            <svg ref={d3Container} />
        </div>
    );
};

export default CarDataVisualization;
