import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@mui/joy";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import * as d3 from 'd3';
import data from '../data/pT.json';
import carData from '../data/car.json';
import { YearlyData, TransportData, YearlyTotalPassengerKM } from '@/data/pTDataInterface';
import { YearlyData as CarYearlyData, CarData, YearlyTotalPassengerKM as CarYearlyTotalPassengerKM } from '@/data/carDataInterface';

const TimeLineChart: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('total_passenger_km');

  const years = Object.keys(data);
  //Helper Function to calculate the yearly change in ref to 2013.
  const yearlyChange = (dataobj: { [year: string]: number }) => {
    let changeObj : { [year: string]: number } = {};
    const baseYear = '2013';
    const ptBaseValue = dataobj[baseYear];
    for (const year in dataobj) {
      if (dataobj.hasOwnProperty(year)) {
        const value = dataobj[year];
        
        // Calculate percentage change relative to the base year (2013)
        const percentageChange = ((dataobj[year] - ptBaseValue) / ptBaseValue) * 100;
    
        // Store the percentage change in the new object
        changeObj[year] = percentageChange;
      }
    }
    return changeObj;
  };

  //Public Transportation data
  const ptFormattedData: YearlyData = data;
  //PT: Yearly Total Passenger KM (accumulated over all states)
  const ptSumPerYear: { [year: string]: number } = Object.keys(data).reduce((acc: YearlyTotalPassengerKM, year) => {
    const sum = ptFormattedData[year].reduce((total:number, entry: TransportData) => total + entry.total_local_passenger_km, 0);
    acc[year] = sum;
    return acc;
  }, {});
  //Percental change of Total Passenger KM in relation to 2013.
  const ptColor = '#32a1b8';
  const ptYearlyChange = yearlyChange(ptSumPerYear);
  const ptMaxChange = d3.max(Object.values(ptYearlyChange)) || 0;
  const ptMinChange = d3.min(Object.values(ptYearlyChange)) || 0;
  //Cars data
  const carsFormattedData: CarYearlyData = carData;
  const carsSumPerYear: { [year: string]: number } = Object.keys(carData).reduce((acc: CarYearlyTotalPassengerKM, year) => {
    const sum = carsFormattedData[year].reduce((total:number, entry: CarData) => total + entry.passenger_km, 0);
    acc[year] = sum;
    return acc;
  }, {});
  const carsColor = '#364a87';
  const carsYearlyChange = yearlyChange(carsSumPerYear);
  const carsMaxChange = d3.max(Object.values(carsYearlyChange)) || 0;
  const carsMinChange = d3.min(Object.values(carsYearlyChange)) || 0;
  //Max and Min % of both sets:
  const max = ptMaxChange >= carsMaxChange ? ptMaxChange : carsMaxChange;
  const min = ptMinChange <= carsMinChange ? ptMinChange : carsMinChange; 
  

  let title = "The Yearly Development of Passenger KMs using Public Transportation and Cars";


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

  
    const updateChart = () => {
      //remove existing shapes before redrawing
      svg.selectAll('.y-axis').remove();

      const xScale = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.7);

      let yScale = d3.scaleLinear()
        .domain([-max, max])
        .range([height, 0]);

      // Draw X-axis
      svg.append('g')
        .attr('transform', `translate(0,${yScale(0)})`)
        .call(d3.axisBottom(xScale));
      // Draw Y-axis
      let yAxis = d3
        .axisLeft(yScale);
        
      svg.append('g')
        .call(yAxis);

      // Draw PT Data
      years.forEach((year, index) => {
        // Add dots at the tops of each bar
        svg.append('circle')
        .attr('class', 'pt-dot')
        .attr('cx', xScale(year) + xScale.bandwidth() / 2)
        .attr('cy', yScale(ptYearlyChange[year]) || 0)
        .attr('r', 6) 
        .attr('fill', ptColor); 
      });
      //Draw lines linking the dots
      years.slice(0, -1).forEach((year, index) => {
        const x1Pos = xScale(year) + xScale.bandwidth() / 2;
        const y1Pos = yScale(ptYearlyChange[year]) || 0;
        const nextYear = years[index + 1];
        const x2Pos = xScale(nextYear) + xScale.bandwidth() / 2;
        const y2Pos = yScale(ptYearlyChange[nextYear]) || 0;

        svg.append('line')
          .attr('class', 'pt-connecting-line')
          .attr('x1', x1Pos)
          .attr('y1', y1Pos)
          .attr('x2', x2Pos)
          .attr('y2', y2Pos)
          .attr('stroke', ptColor)
          .attr('stroke-width', 4);;  // You can set the color as needed
      });

      //Draw Cars Data
      years.forEach((year, index) => {
        // Add dots at the tops of each bar
        svg.append('circle')
        .attr('class', 'cars-dot')
        .attr('cx', xScale(year) + xScale.bandwidth() / 2)
        .attr('cy', yScale(carsYearlyChange[year]) || 0)
        .attr('r', 6) 
        .attr('fill', carsColor); 
      });
      //Draw lines linking the dots
      years.slice(0, -1).forEach((year, index) => {
        const x1Pos = xScale(year) + xScale.bandwidth() / 2;
        const y1Pos = yScale(carsYearlyChange[year]) || 0;
        const nextYear = years[index + 1];
        const x2Pos = xScale(nextYear) + xScale.bandwidth() / 2;
        const y2Pos = yScale(carsYearlyChange[nextYear]) || 0;

        svg.append('line')
          .attr('class', 'cars-connecting-line')
          .attr('x1', x1Pos)
          .attr('y1', y1Pos)
          .attr('x2', x2Pos)
          .attr('y2', y2Pos)
          .attr('stroke', carsColor)
          .attr('stroke-width', 4);;  // You can set the color as needed
      });

      //if only one data set is selected, delete the non-selected one
      if (selectedDataset === 'total_passenger_km') {
        d3.select(chartRef.current).selectAll(".cars-connecting-line").remove();
        d3.select(chartRef.current).selectAll(".cars-dot").remove();
        title = 'The Yearly Development of Passenger KMs using Public Transportation';
        //TODO: redraw y-axis
      } else if (selectedDataset === 'car_passenger_km') {
        d3.select(chartRef.current).selectAll(".pt-connecting-line").remove();
        d3.select(chartRef.current).selectAll(".pt-dot").remove();
        title = 'The Yearly Development of Passenger KMs using Cars';
      }

      // Add chart title
      svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2) // Position above the chart area
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .text(title);
    }

    updateChart();

  }, [selectedDataset, isPlaying]);
  
  return (
    <Card>
      <div>
        <label htmlFor="datasetSelect">Select Dataset: </label>
        <Select id="datasetSelect" value={selectedDataset} sx={{ width: 300 }}>
          <Option value="total_passenger_km" onClick={() => setSelectedDataset("total_passenger_km")}>Public Transporation</Option>
          <Option value="car_passenger_km" onClick={() => setSelectedDataset("car_passenger_km")}>Cars</Option>
          <Option value="both" onClick={() => setSelectedDataset("both")}>Public Transportation and Cars</Option>
        </Select>
        <svg ref={chartRef}></svg>

      </div>
    </Card>
  );
};

export default TimeLineChart;
