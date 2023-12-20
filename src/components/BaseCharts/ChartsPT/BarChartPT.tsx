import { Select, Option, Stack, Button } from "@mui/joy";
import { Sort, Calculate } from '@mui/icons-material';
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TransportData, YearlyData } from '@/data/pTDataInterface';
import { PopulationData, YearlyData as PopulationYearlyData } from '@/data/populationInterface';


interface Props {
    data: YearlyData;
    populationData: PopulationYearlyData;
}

const TransportDataVisualization: React.FC<Props> = ({ data, populationData }) => {
    const [selectedYear, setSelectedYear] = useState<string>('2013');
    const [selectedMetric, setSelectedMetric] = useState<keyof TransportData>('total_local_passengers');
    const [sortByPopulation, setSortByPopulation] = useState(false);
    const [inRelationToPopulation, setInRelationToPopulation] = useState(false);
    const [originalData, setOriginalData] = useState<YearlyData | null>(null);
    const d3Container = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        setOriginalData(data);
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


            //const color = d3.scaleOrdinal(d3.schemeCategory10);
            //const color = d3.scaleOrdinal(d3.schemeAccent);
            //const color = d3.scaleOrdinal(['#000000', '#252525', '#171723', '#004949', '#490092', '#920000', '#8f4e00', '#22cf22','#223567', '#676767', '#006ddb', '#009999', '#b66dff', '#ff6db6', '#db6d00', '#ffdf4d']);
            const color = d3.scaleOrdinal(['#68023F'
                ,'#008169'
                ,'#EF0096'
                ,'#00DCB5'
                ,'#FFCFE2'
                ,'#003C86'
                ,'#9400E6'
                ,'#FF6E3A'
                ,'#009FFA'
                ,'#FF71FD'
                ,'#7CFFFA'
                ,'#6A0213'
                ,'#008607'
                ,'#F60239'
                ,'#FFDC3D'
                ,'#00EBC1']);

            const updateChart = (year: string, metric: keyof TransportData) => {
                if (!originalData) return;



                // Doing this to avoid mutating the original data
                let yearData = JSON.parse(JSON.stringify(originalData[year]));

                // Sort data
                //
                //let sortedData = [...yearData].sort((a, b) => (b[selectedMetric] as number) - (a[selectedMetric] as number));

                if (inRelationToPopulation) {
                    const populationMap = new Map(populationData[selectedYear].map(d => [d.state, d.population]));
                    // @ts-ignore
                    yearData.forEach(d => {
                        const population = populationMap.get(d.state) || 1;
                        // @ts-ignore
                        d[metric] = (d[metric] as number) / population;
                    });
                }
                
                if (sortByPopulation) {
                    const populationMap = new Map(populationData[selectedYear].map(d => [d.state, d.population]));
                    // @ts-ignore
                    yearData.sort((a, b) => (populationMap.get(b.state) || 0) - (populationMap.get(a.state) || 0));
                } else {
                    // Sort data with proper typing for the metric
                    // @ts-ignore
                    yearData.sort((a, b) => (b[metric] as number) - (a[metric] as number));

                }

                 // Determine the 3 highest values
                let sortedData = [...yearData];
                sortedData.sort((a, b) => (b[selectedMetric] as number) - (a[selectedMetric] as number));
                let top3Values = sortedData.slice(0, 3).map(d => d[selectedMetric]);

                // @ts-ignore
                x.domain(yearData.map(d => d.state));
                // @ts-ignore
                y.domain([0, d3.max(yearData, d => d[metric] as number) as number]);

                // Remove existing bars before redrawing
                svg.selectAll(".bar").remove();

                const bars = svg.selectAll<SVGRectElement, TransportData>(".bar")
                    // @ts-ignore
                    .data(yearData, d => d.state);

                bars.enter().append("rect")
                    .attr("class", "bar")
                    // @ts-ignore
                    .attr("x", d => x(d.state) as number)
                    .attr("width", x.bandwidth())
                    .attr("y", height)
                    .attr("height", 0)
                    .merge(bars)
                    .transition()
                    .duration(750)
                    // @ts-ignore
                    .attr("y", d => y(d[metric] as number))
                    // @ts-ignore
                    .attr("height", d => height - y(d[metric] as number))
                    // @ts-ignore
                    .attr("fill", d => top3Values.includes(d[metric]) ? "#008000" : "#004949");
                //.attr("fill", (d, i) => color(i.toString()));

                bars.exit().remove();

                svg.select<SVGGElement>(".x-axis").call(d3.axisBottom(x) as any);
                svg.select<SVGGElement>(".y-axis").call(d3.axisLeft(y) as any);
            };

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`);

            svg.append("g")
                .attr("class", "y-axis");

            updateChart(selectedYear, selectedMetric);
        }
    }, [originalData, data, selectedYear, selectedMetric, sortByPopulation, populationData, inRelationToPopulation]);

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
                <Select defaultValue="total_local_passengers" sx={{ maxWidth: "250px", marginLeft: "10px" }}>
                    <Option value="total_local_passengers" onClick={() => setSelectedMetric('total_local_passengers')}>Total Local Passengers</Option>
                    <Option value="total_local_passenger_km" onClick={() => setSelectedMetric('total_local_passenger_km')}>Total Local Passenger Km</Option>
                </Select>
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

export default TransportDataVisualization;
