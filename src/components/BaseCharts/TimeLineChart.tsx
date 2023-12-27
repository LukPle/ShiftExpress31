import React, { useEffect, useRef, useState } from 'react';
import { Card, IconButton, Stack, Select, Option } from "@mui/joy";
import { PauseCircleFilled, PlayCircleFilled, ReplayCircleFilled, StopCircle } from '@mui/icons-material';
import * as d3 from 'd3';
import data from '../../data/pT.json';
import carData from '../../data/car.json';
import { YearlyData, TransportData, YearlyTotalPassengerKM } from '@/data/pTDataInterface';
import { YearlyData as CarYearlyData, CarData, YearlyTotalPassengerKM as CarYearlyTotalPassengerKM } from '@/data/carDataInterface';
import chartStyles from '../../styles/chart.module.css';

interface TimeLineChartProps {
  startYearProp: string;
  endYearProp: string;
}


const TimeLineChart: React.FC<TimeLineChartProps> = ( {startYearProp, endYearProp} ) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('pt_passenger_km');
  const [startYear, setStartYear] = useState<string>(startYearProp);
  const [endYear, setEndYear] = useState<string>(endYearProp);

  const years = Object.keys(data);
  //Helper Function to calculate the yearly change in ref to 2013.
  const yearlyChange = (dataobj: { [year: string]: number }) => {
    let changeObj : { [year: string]: number } = {};
    const baseYear = '2013';
    const ptBaseValue = dataobj[baseYear];
    for (const year in dataobj) {
      if (dataobj.hasOwnProperty(year)) {
        // Calculate percentage change relative to the base year (2013)
        const percentageChange = (((dataobj[year] - ptBaseValue) / ptBaseValue) * 100);
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

  let carsFormattedData: CarYearlyData = carData;
  const carsSumPerYear: { [year: string]: number } = Object.keys(carData).reduce((acc: CarYearlyTotalPassengerKM, year) => {
    const sum = carsFormattedData[year]
    .filter((entry: CarData) => entry.state !== 'FEDERAL')
    .reduce((total:number, entry: CarData) => total + entry.passenger_km, 0);
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

  let title = "The %-Change in Passenger KMs using Public Transportation and Cars in relation to 2013";


  useEffect(() => {
    if (!chartRef.current) return;
    // Clear the existing SVG content
    d3.select(chartRef.current).selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 100, right: 80, bottom: 30, left: 125 };

    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    //Make sure that the selected start year is always < the end year
    const startYearInt = parseInt(startYear, 10);
    const endYearInt = parseInt(endYear, 10);
    if (isNaN(endYearInt) || isNaN(startYearInt) || endYearInt <= startYearInt) {
      setStartYear((2013).toString());
      setEndYear((2022).toString());
    }

    const updateChart = () => {
        console.log(animationFinished);
        //remove existing shapes before redrawing
        svg.selectAll('.y-axis').remove();
        svg.selectAll('.x-axis').remove();
        
        const selectedYears: string[] = [];
        for (let year = parseInt(startYear); year <= parseInt(endYear); year++) {
          selectedYears.push(year.toString()); // Convert each year to a string
        }

        const xScale = d3.scaleBand()
        .domain(selectedYears)
        .range([0, width])
        .padding(0.7);

        let yScale = d3.scaleLinear()
          .domain([ptMinChange - 10, ptMaxChange + 5])
          .range([height, 0]);
        let yAxis = d3
          .axisLeft(yScale);

        const drawData = (key: string, data:  { [year: string]: number }, yS: d3.ScaleLinear<number, number, never>, color: string) => {
          // Draw Data Points
          let currentIndex = 0;
            // Function to draw a single data point (dot and connecting line)
          const drawSingleDataPoint = (index: number) => {
            const year = selectedYears[index];
            const x = (xScale(year) as number) + xScale.bandwidth() / 2
            const y = yS(data[year]) || 0;
            // Draw dot
            svg.append('circle')
              .attr('class', `${key}-dot`)
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', 6)
              .attr('fill', color);
            // Draw connecting line (skip for the first point)
            if (index > 0) {
              const xPrev = (xScale(selectedYears[index - 1]) as number) + xScale.bandwidth() / 2;
              const yPrev = yS(data[selectedYears[index - 1]]) || 0;
              svg.append('line')
                .attr('class', `${key}-connecting-line`)
                .attr('x1', xPrev)
                .attr('y1', yPrev)
                .attr('x2', x)
                .attr('y2', y)
                .attr('stroke', color)
                .attr('stroke-width', 4);
            }
          };

          // Draw the first data point immediately
          drawSingleDataPoint(currentIndex);

          const interval = setInterval(() => {
            currentIndex++;
            // Stop the animation when all data points are drawn
            if (currentIndex >= selectedYears.length) {
              clearInterval(interval);
              setAnimationFinished(true);
            } else {
              // Draw the next data point
              drawSingleDataPoint(currentIndex);
            }
          }, 600);
        }

      //Depending on the selected option, draw
      if (selectedDataset === 'pt_passenger_km') {
        title = 'The %-Change in Passenger KMs using Public Transportation in relation to 2013';
        //draw y-axis and x-axis
        svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${yScale(0)})`)
          .call(d3.axisBottom(xScale))

        svg.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);
        //draw data points
        if (isPlaying) {
          drawData('pt', ptYearlyChange, yScale, ptColor);
        }
      } else if (selectedDataset === 'car_passenger_km') {
        title = 'The %-Change in Passenger KMs using Cars in relation to 2013';
        //adjust yscale and y-axis
        yScale.domain([carsMinChange, carsMaxChange + 2]); //added 2 for visibility
        svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${yScale(0)})`)
          .call(d3.axisBottom(xScale));
        svg.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);
        //draw data points
        if (isPlaying) {
          drawData('cars', carsYearlyChange, yScale, carsColor);
        }
      } else {
        //adjust yscale and y-axis
        title = 'The %-Change in Passenger KMs using Public Transportation and Cars in relation to 2013';
        //adjust yscale and y-axis
        yScale.domain([(-max < min ? -max: min) - 10, (max > - min ? max : -min) + 10]);
        svg.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${yScale(0)})`)
          .call(d3.axisBottom(xScale));
        svg.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);
        //draw data points
        if (isPlaying) {
          drawData('pt', ptYearlyChange, yScale, ptColor);
          drawData('cars', carsYearlyChange, yScale, carsColor);
        }
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

  }, [selectedDataset, isPlaying, startYear, endYear]);
  
  return (
    <Card>
      <div>
        <Stack direction="row" spacing={1}>
          <Stack direction="column">
            <label htmlFor="startYearSelect">Start Year</label>
            <Select id="startYearSelect" value={parseInt(startYear, 10)} sx={{ width: 100 }}>
              {Array.from({ length: 10 }, (_, index) => {
                const year = 2013 + index;
                return <Option key={year} value={year} onClick={() => setStartYear(year.toString())}>{year}</Option>;
              })}
            </Select>
            <label htmlFor="endYearSelect">End Year</label>
            <Select id="endYearSelect" value={parseInt(endYear, 10)} sx={{ width: 100 }}>
              {Array.from({ length: 10 }, (_, index) => {
                const year = 2013 + index;
                return <Option key={year} value={year} onClick={() => setEndYear(year.toString())}>{year}</Option>;
              })}
            </Select>
          </Stack>
          <Stack direction="column">
            <label htmlFor="datasetSelect">Dataset</label>
            <Select id="datasetSelect" value={selectedDataset} sx={{ width: 300 }}>
              <Option value="pt_passenger_km" onClick={() => setSelectedDataset("pt_passenger_km")}>Public Transporation</Option>
              <Option value="car_passenger_km" onClick={() => setSelectedDataset("car_passenger_km")}>Cars</Option>
              <Option value="both" onClick={() => setSelectedDataset("both")}>Public Transportation and Cars</Option>
            </Select>
          </Stack>
        </Stack>
        <svg ref={chartRef}></svg>
        <Stack direction="row" spacing={1}>
          {((!isPlaying || isPaused || animationFinished) && (
            <IconButton className='play-button' variant="solid" onClick={() => {setIsPlaying(true); setIsPaused(false);} }>
              <PlayCircleFilled />
            </IconButton>
          )) || ((!animationFinished || !isPaused)&& (
            <IconButton className='pause-button' variant="solid" onClick={() => {setIsPaused(true); setAnimationFinished(false); setIsPlaying(false);} }>
              <PauseCircleFilled />
            </IconButton>
          ))}
          <IconButton className="stop-button" variant="solid" onClick={() => {setIsPlaying(false); setAnimationFinished(false); setIsPaused(true);} }>
            <StopCircle />
          </IconButton>
        </Stack>
      </div>
    </Card>
  );
};

export default TimeLineChart;
