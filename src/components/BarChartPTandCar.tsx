import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TransportData, YearlyData as YearlyDataPT } from '../data/pTDataInterface';
import { CarData, YearlyData as YearlyDataCars } from '../data/carDataInterface';
import { Select } from '@mui/joy';

interface Props {
  data: {
    dataPT: YearlyDataPT;
    dataCars: YearlyDataCars;
  };
}

const CombinedDataVisualization: React.FC<Props> = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState('2013');
    const d3Container = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data.dataCars && data.dataPT && d3Container.current) {
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 90 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x0 = d3.scaleBand()
                .range([0, width])
                .paddingInner(0.1)
                .paddingOuter(0.1);
            const x1 = d3.scaleBand()
                .padding(0.05);
            const y = d3.scaleLinear()
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            const updateChart = (year: string) => {
                const carYearData = data.dataCars[year].filter(d => d.state !== 'FEDERAL');
                const publicTransportYearData = data.dataPT[year].filter(d => d.state !== 'FEDERAL');

                const allStates = Array.from(new Set<string>([
                  ...carYearData.map(d => d.state || d.state), 
                  ...publicTransportYearData.map(d => d.state || d.state)
              ]));
              

                x0.domain(allStates);
                x1.domain(['car', 'publicTransport']).range([0, x0.bandwidth()]);
                y.domain([0, d3.max([...carYearData, ...publicTransportYearData], d => {
                  if ('passenger_km' in d) {
                      return (d as CarData).passenger_km;
                  } else if ('total_local_passenger_km' in d) {
                      return (d as TransportData).total_local_passenger_km;
                  }
                  return 0;
              }) as number]);
              

                svg.append("g")
                    .selectAll("g")
                    .data(allStates)
                    .enter().append("g")
                    .attr("transform", d => `translate(${x0(d)},0)`)
                    .selectAll("rect")
                    .data((state: string) => [
                        { type: 'car', value: carYearData.find(d => d.state === state)?.passenger_km || 0 },
                        { type: 'publicTransport', value: publicTransportYearData.find(d => d.state === state)?.total_local_passenger_km || 0 }
                    ])
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", d => x1(d.type) as number)
                    .attr("y", height)
                    .attr("width", x1.bandwidth())
                    .attr("height", 0)
                    .attr("fill", (d, i) => color(i.toString()))
                    .transition()
                    .duration(750)
                    .attr("y", d => y(d.value))
                    .attr("height", d => height - y(d.value));
                
                // Axes code remains similar, update as needed

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x0));

                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y));
            };

            svg.append("g")
                .attr("class", "legend")
                .selectAll("rect")
                .data(['Car', 'Public Transport'])
                .enter().append("rect")
                .attr("x", (d, i) => i * 120)
                .attr("y", height + margin.top)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", (d, i) => color(i.toString()));

            svg.select(".legend")
                .selectAll("text")
                .data(['Car', 'Public Transport'])
                .enter().append("text")
                .attr("x", (d, i) => i * 120 + 25)
                .attr("y", height + margin.top + 9)
                .attr("dy", "0.35em")
                .style("text-anchor", "start")
                .text(d => d);

            updateChart(selectedYear);
        }
    }, [data.dataCars, data.dataPT, selectedYear]);

    return (
        <div>
            <Select defaultValue="2013" sx={{ maxWidth: "100px" }}>
                {/* Options remain the same as before */}
            </Select>
            <svg ref={d3Container} />
        </div>
    );
};

export default CombinedDataVisualization;
