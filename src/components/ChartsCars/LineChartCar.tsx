// TransportDataVisualization.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData } from '../../data/carDataInterface';

interface Props {
    data: YearlyData;
}

const CarDataVisualization: React.FC<Props> = ({ data }) => {
    const d3Container = useRef<SVGSVGElement | null>(null);

    // Data transformation
    const transformData = (data: YearlyData): { state: string; values: { year: string; passengers: number; }[] }[] => {
        const states = new Set<string>();
        Object.values(data).forEach(yearData => yearData.forEach(d => {
            if (d.state !== 'FEDERAL') {
                states.add(d.state);
            }
        }));

        const seriesData: { state: string; values: { year: string; passengers: number; }[] }[] = [];
        states.forEach(state => {
            const stateData = { state, values: [] as { year: string; passengers: number; }[] };
            for (const year in data) {
                const yearDatum = data[year].find(d => d.state === state);
                if (yearDatum) {
                    stateData.values.push({ year, passengers: yearDatum.passenger_km });
                }
            }
            seriesData.push(stateData);
        });
        return seriesData;
    };


    useEffect(() => {
        if (data && d3Container.current) {
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
            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(Object.values(data).flat(), d => d.passenger_km) as number]);

            const color = d3.scaleOrdinal(d3.schemeCategory10); // Using a D3 color scheme

            const line = d3.line<{ year: string; passengers: number }>()
                .x(d => x(d.year) as number)
                .y(d => y(d.passengers));

            const series = transformData(data);

            // Find the new maximum value for the y-axis domain after filtering 'federal'
            const maxPassengers = d3.max(series.flatMap(s => s.values), d => d.passengers) ?? 0; // Use nullish coalescing to default to 0

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
                    .attr("transform", `translate(${width},${y(s.values[s.values.length - 1].passengers)})`)
                    .attr("dy", ".35em")
                    .attr("dx", ".35em")
                    .attr("text-anchor", "start")
                    .style("fill", color(s.state))
                    .text(s.state);
            });

            svg.select<SVGGElement>(".y-axis").call(d3.axisLeft(y) as any); // Cast to 'any' to bypass type error

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));
        }
    }, [data]);

    return (
        <div>
            <svg ref={d3Container} />
        </div>
    );
};

export default CarDataVisualization;
