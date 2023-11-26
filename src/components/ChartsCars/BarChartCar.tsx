import { Select, Option, Stack } from "@mui/joy"
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData } from '../../data/carDataInterface';

interface Props {
    data: YearlyData;
}

const CarDataVisualization: React.FC<Props> = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState('2013');
    const [selectedMetric, setSelectedMetric] = useState<keyof CarData>('passenger_km');
    const d3Container = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data && d3Container.current) {
            // Clear the existing SVG content
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 90 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
            const y = d3.scaleLinear()
                .range([height, 0]);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            // Function to update the chart
            const updateChart = (year: string, metric: keyof CarData) => {
                let yearData = data[year];

                // Filter out 'federal' data
                yearData = yearData.filter(d => d.state !== 'FEDERAL');

               // Sort data with proper typing for the metric
               yearData.sort((a, b) => (b[metric] as number) - (a[metric] as number));

                x.domain(yearData.map(d => d.state));
                y.domain([0, d3.max(yearData, d => d[metric] as number) as number]);

                // Remove existing bars before redrawing
                svg.selectAll(".bar").remove();

                const bars = svg.selectAll<SVGRectElement, CarData>(".bar")
                    .data(yearData, d => d.state) as d3.Selection<SVGRectElement, CarData, SVGGElement, unknown>;

                    bars.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", d => x(d.state) as number)
                    .attr("width", x.bandwidth())
                    .attr("y", height)
                    .attr("height", 0)
                    .merge(bars)
                    .transition()
                    .duration(750)
                    .attr("y", d => y(d[metric] as number))
                    .attr("height", d => height - y(d[metric] as number))
                    .attr("fill", (d, i) => color(i.toString()));


                bars.exit().remove();

                // Update axes
                svg.select<SVGGElement>(".x-axis").call(d3.axisBottom(x) as any);
                svg.select<SVGGElement>(".y-axis").call(d3.axisLeft(y) as any);
            };

            // Append the x and y axis groups
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`);

            svg.append("g")
                .attr("class", "y-axis");

            // Initial chart render
            updateChart(selectedYear, selectedMetric);
        }
    }, [data, selectedYear, selectedMetric]);

    return (
        <div>
            <Stack direction={"row"}>
                <Select defaultValue="2013" sx={{ maxWidth: "100px" }}>
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
                <Select defaultValue="passenger_km" sx={{ maxWidth: "250px", marginLeft: "10px" }}>
                    <Option value="passenger_km" onClick={() => setSelectedMetric('passenger_km')}>Total Passenger KMs</Option>
                    <Option value="per_car_km" onClick={() => setSelectedMetric('per_car_km')}>Per Car Km</Option>
                    <Option value="per_car_pass_km" onClick={() => setSelectedMetric('per_car_pass_km')}>Per Car Passenger Km</Option>
                    <Option value="cars" onClick={() => setSelectedMetric('cars')}>Number of Cars</Option>
                </Select>
            </Stack>
            <svg ref={d3Container} />
        </div>
    );
};

export default CarDataVisualization;
