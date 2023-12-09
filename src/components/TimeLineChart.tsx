import React, { useEffect, useRef, useState } from 'react';
import { Card, Stack } from "@mui/joy";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import * as d3 from 'd3';
import data from '../data/pT.json';
import carData from '../data/car.json';
import { YearlyData, TransportData, YearlyTotalPassengerKM } from '@/data/pTDataInterface';
import { YearlyData as CarYearlyData, CarData, YearlyTotalPassengerKM as CarYearlyTotalPassengerKM } from '@/data/carDataInterface';

const TimeLineChart: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('total_passenger_km');

  useEffect(() => {
    if (!chartRef.current) return;
    // Clear the existing SVG content
    d3.select(chartRef.current).selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 100, right: 30, bottom: 30, left: 125 };

    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const years = Object.keys(data);
    let sumPerYear: { [year: string]: number }
    let maxSum = 0;
    let title = "The Yearly Development of Passenger KMs using Public Transportation";
    const updateChart = (metric: string) => {
      if (selectedDataset === 'total_passenger_km') {
        const formattedData: YearlyData = data;
        sumPerYear = Object.keys(data).reduce((acc: YearlyTotalPassengerKM, year) => {
          const sum = formattedData[year].reduce((total:number, entry: TransportData) => total + entry.total_local_passenger_km, 0);
          acc[year] = sum;
          return acc;
        }, {});
        maxSum = 120000000000;
        console.log("PT " + maxSum);
      } else {
          const formattedData: CarYearlyData = carData;
          sumPerYear = Object.keys(carData).reduce((acc: CarYearlyTotalPassengerKM, year) => {
            const sum = formattedData[year].reduce((total:number, entry: CarData) => total + entry.passenger_km, 0);
            acc[year] = sum;
            return acc;
          }, {});
          maxSum = 1800000000000;
          title = "The Yearly Development of Passenger KMs using Cars";
          console.log("cars: " + maxSum);
      }

      //remove existing shapes before redrawing
      svg.selectAll('rect').remove();
      svg.selectAll('.y-axis').remove();

      const xScale = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.9);

      const yScale = d3.scaleLinear()
        .domain([0, maxSum])
        .range([height, 0]);

      // Draw X-axis
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
      // Draw Y-axis
      svg.append('g')
        .call(d3.axisLeft(yScale));
      // Draw bars
      years.forEach((year, index) => {
        svg.selectAll(`.bar-${year}`)
          .data([sumPerYear[year]])
          .enter()
          .append('rect')
          .attr('class', `bar-${year}`)
          .attr('x', xScale(year) || 0)
          .attr('y', d => yScale(d) || 0)
          .attr('width', xScale.bandwidth())
          .attr('height', d => height - yScale(d) || 0)
          .attr('fill', `rgb(${index * 25}, 0, 0)`);

        // Add dots at the tops of each bar
        svg.append('circle')
        .attr('class', 'dot')
        .attr('cx', xScale(year) + xScale.bandwidth() / 2)
        .attr('cy', yScale(sumPerYear[year]) || 0)
        .attr('r', 5)  // Adjust the radius as needed
        .attr('fill', 'blue');  // You can set the color as needed
      });

      //Draw lines linking the tops of the bars
      years.slice(0, -1).forEach((year, index) => {
        const x1Pos = xScale(year) + xScale.bandwidth() / 2;
        const y1Pos = yScale(sumPerYear[year]) || 0;

        const nextYear = years[index + 1];
        const x2Pos = xScale(nextYear) + xScale.bandwidth() / 2;
        const y2Pos = yScale(sumPerYear[nextYear]) || 0;

        svg.append('line')
          .attr('class', 'connecting-line')
          .attr('x1', x1Pos)
          .attr('y1', y1Pos)
          .attr('x2', x2Pos)
          .attr('y2', y2Pos)
          .attr('stroke', 'blue');  // You can set the color as needed
      });

      // Add chart title
      svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2) // Position above the chart area
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .text(title);


    }
    updateChart(selectedDataset);

  }, [selectedDataset]);
  
  return (
    <Card>
      <div>
        <label htmlFor="datasetSelect">Select Dataset: </label>
        <Select id="datasetSelect" value={selectedDataset} sx={{ width: 210 }}>
          <Option value="total_passenger_km" onClick={() => setSelectedDataset("total_passenger_km")}>Public Transporation</Option>
          <Option value="car_passenger_km" onClick={() => setSelectedDataset("car_passenger_km")}>Cars</Option>
        </Select>
        <svg ref={chartRef}></svg>
      </div>
    </Card>
  );
};

export default TimeLineChart;
