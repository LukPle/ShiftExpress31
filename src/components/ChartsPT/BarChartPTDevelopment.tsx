import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Select, Option } from "@mui/joy";
import { YearlyData } from '../../data/pTDataInterface';

interface Props {
    data: YearlyData;
}

const TransportDataChangeVisualization: React.FC<Props> = ({ data }) => {
    const [startYear, setStartYear] = useState('2013');
    const [endYear, setEndYear] = useState('2022');
    const d3Container = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data && d3Container.current) {
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

            // Function to calculate percentage change
            const calculatePercentageChange = (state: string) => {
                const startYearData = data[startYear].find(d => d.state === state);
                const endYearData = data[endYear].find(d => d.state === state);

                if (!startYearData || !endYearData) {
                    return 0;
                }

                return ((endYearData.total_local_passengers - startYearData.total_local_passengers) / startYearData.total_local_passengers) * 100;
            };

            // Calculate the percentage change for each state
            const percentageChanges = Object.values(data[startYear]).map(d => ({
                state: d.state,
                change: calculatePercentageChange(d.state)
            }));

            // Sort data
            percentageChanges.sort((a, b) => b.change - a.change);

            x.domain(percentageChanges.map(d => d.state));
            y.domain([d3.min(percentageChanges, d => d.change) as number, d3.max(percentageChanges, d => d.change) as number]);

            svg.selectAll(".bar").remove();

            svg.selectAll<SVGRectElement, typeof percentageChanges[0]>(".bar")
                .data(percentageChanges)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.state) as number)
                .attr("width", x.bandwidth())
                .attr("y", d => y(Math.max(0, d.change)))
                .attr("height", d => Math.abs(y(d.change) - y(0)))
                .attr("fill", (d, i) => color(i.toString()));

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x) as any);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(y) as any);
        }
    }, [data, startYear, endYear]);

    return (
        <div>
            <Select defaultValue="2013" sx={{ maxWidth: "100px" }}>
                <Option value="2013" onClick={() => setStartYear('2013')}>2013</Option>
                <Option value="2014" onClick={() => setStartYear('2014')}>2014</Option>
                <Option value="2015" onClick={() => setStartYear('2015')}>2015</Option>
                <Option value="2016" onClick={() => setStartYear('2016')}>2016</Option>
                <Option value="2017" onClick={() => setStartYear('2017')}>2017</Option>
                <Option value="2018" onClick={() => setStartYear('2018')}>2018</Option>
                <Option value="2019" onClick={() => setStartYear('2019')}>2019</Option>
                <Option value="2020" onClick={() => setStartYear('2020')}>2020</Option>
                <Option value="2021" onClick={() => setStartYear('2021')}>2021</Option>
                <Option value="2022" onClick={() => setStartYear('2022')}>2022</Option>
            </Select>
            <Select defaultValue="2022" sx={{ maxWidth: "100px" }}>
                <Option value="2013" onClick={() => setEndYear('2013')}>2013</Option>
                <Option value="2014" onClick={() => setEndYear('2014')}>2014</Option>
                <Option value="2015" onClick={() => setEndYear('2015')}>2015</Option>
                <Option value="2016" onClick={() => setEndYear('2016')}>2016</Option>
                <Option value="2017" onClick={() => setEndYear('2017')}>2017</Option>
                <Option value="2018" onClick={() => setEndYear('2018')}>2018</Option>
                <Option value="2019" onClick={() => setEndYear('2019')}>2019</Option>
                <Option value="2020" onClick={() => setEndYear('2020')}>2020</Option>
                <Option value="2021" onClick={() => setEndYear('2021')}>2021</Option>
                <Option value="2022" onClick={() => setEndYear('2022')}>2022</Option>
            </Select>
            <svg ref={d3Container} />
        </div>
    );
};

export default TransportDataChangeVisualization;
