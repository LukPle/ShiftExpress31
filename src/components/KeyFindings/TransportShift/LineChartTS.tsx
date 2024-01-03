// LineChartCombined.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { YearlyData as CarYearlyData, CarData } from '@/data/carDataInterface';
import { YearlyData as TransportYearlyData, TransportData } from '@/data/pTDataInterface';
import { Card } from "@mui/joy";
import styles from "@/styles/charts.module.css";

interface LineChartCombinedProps {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    startYear: string;
    endYear: string;
}

const LineChartTS: React.FC<LineChartCombinedProps> = ({ carData, transportData, startYear, endYear }) => {
    const d3Container = useRef(null);
    const margin = { top: 10, right: 30, bottom: 20, left: 20 };
    const width = 800 - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const [currentYear, setCurrentYear] = useState(startYear);
    const markerRef = useRef(null);

    useEffect(() => {
        if ((carData && transportData) && d3Container.current) {
            // Clear the previous SVG content
            d3.select(d3Container.current).selectAll('*').remove();

            const svg = d3
                .select(d3Container.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Process Car Data
            const carPercentageChangeData = calculatePercentageChange(carData, 'passenger_km', startYear, endYear);

            // Process Transport Data
            const transportPercentageChangeData = calculatePercentageChange(transportData, 'total_local_passenger_km', startYear, endYear);

            // Scales
            const x = d3
                .scaleLinear()
                .domain(d3.extent(carPercentageChangeData, (d) => d.year) as [number, number])
                .range([0, width]);

            const y = d3
                .scaleLinear()
                .domain([
                    Math.min(d3.min(carPercentageChangeData, (d) => d.percentageChange) as number, d3.min(transportPercentageChangeData, (d) => d.percentageChange) as number),
                    Math.max(d3.max(carPercentageChangeData, (d) => d.percentageChange) as number, d3.max(transportPercentageChangeData, (d) => d.percentageChange) as number)
                ])
                .range([height, 0]);

            // X axis
            const allYears = carPercentageChangeData.map(d => d.year); // Assuming this is an array of all years you have data for.
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .tickValues(allYears) // Set the tick values to the years from your data
                    .tickFormat(d3.format('d'))); // Format ticks as integers without comma separators


            // Y axis
            svg.append('g').call(d3.axisLeft(y));

            // Car Data Line
            svg
                .append('path')
                .datum(carPercentageChangeData)
                .attr('fill', 'none')
                .attr('stroke', '#9B8D8C')
                .attr('stroke-width', 5)
                .attr(
                    'd',
                    d3
                        .line<any>()
                        .x((d) => x(d.year))
                        .y((d) => y(d.percentageChange))
                );

            // Transport Data Line
            svg
                .append('path')
                .datum(transportPercentageChangeData)
                .attr('fill', 'none')
                .attr('stroke', '#03045A')
                .attr('stroke-width', 5)
                .attr(
                    'd',
                    d3
                        .line<any>()
                        .x((d) => x(d.year))
                        .y((d) => y(d.percentageChange))
                );


            // Add an overlay to capture mouse events on the canvas for the dots and the marker
            const overlay = svg.append('rect')
                .attr('class', 'overlay')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all');

            // Add circles for the data points
            const focusCar = svg.append('g')
                .append('circle')
                .style('fill', 'steelblue')
                .attr('r', 7)
                .style('display', 'none');

            const focusTransport = svg.append('g')
                .append('circle')
                .style('fill', 'green')
                .attr('r', 7)
                .style('display', 'none');

            // Add text to show the data point values
            const focusTextCar = svg.append('g')
                .append('text')
                .style('opacity', 0)
                .attr('text-anchor', 'left')
                .attr('alignment-baseline', 'middle');

            const focusTextPT = svg.append('g')
                .append('text')
                .style('opacity', 0)
                .attr('text-anchor', 'left')
                .attr('alignment-baseline', 'middle');

            // Function to find the closest data point for tooltip
            //@ts-ignore
            const mousemove = (event) => {
                //@ts-ignore
                const bisect = d3.bisector((d) => d.year).center;
                const xPos = d3.pointer(event, this)[0];
                const x0 = x.invert(xPos);
                const i = bisect(carPercentageChangeData, x0, 1);
                const selectedDataCar = carPercentageChangeData[i];
                const selectedDataTransport = transportPercentageChangeData[i];

                focusCar
                    .attr('cx', x(selectedDataCar.year))
                    .attr('cy', y(selectedDataCar.percentageChange))
                    .style('display', null);

                focusTransport
                    .attr('cx', x(selectedDataTransport.year))
                    .attr('cy', y(selectedDataTransport.percentageChange))
                    .style('display', null);

                focusTextCar
                    .html(`Year: ${selectedDataCar.year}<br/> Car: ${selectedDataCar.percentageChange}%`)
                    .attr('x', x(selectedDataCar.year) + 15)
                    .attr('y', y(selectedDataCar.percentageChange))
                    .style('opacity', 1);

                focusTextPT
                    .html(`Year: ${selectedDataCar.year}<br/> Transport: ${selectedDataTransport.percentageChange}%`)
                    .attr('x', x(selectedDataCar.year) + 15)
                    .attr('y', y(selectedDataTransport.percentageChange))
                    .style('opacity', 1);
            };

            // Event listeners for the overlay for tooltip
            overlay
                .on('mouseover', () => {
                    focusCar.style('display', null);
                    focusTransport.style('display', null);
                    focusTextCar.style('opacity', 1);
                    focusTextPT.style('opacity', 1);
                })
                .on('mouseout', () => {
                    focusCar.style('display', 'none');
                    focusTransport.style('display', 'none');
                    focusTextCar.style('opacity', 0);
                    focusTextPT.style('opacity', 0);
                })
                .on('mousemove', mousemove);


            // Event listener for the overlay for changing the current year
            overlay
                .on('click', (event) => {
                    const xPos = d3.pointer(event, this)[0];
                    // @ts-ignore
                    const yearScale = d3.scaleBand().domain(allYears).range([0, width]);
                    // @ts-ignore
                    const clickedYear = yearScale.domain().find(year => yearScale(year) <= xPos && xPos < yearScale(year) + yearScale.bandwidth());
                    // @ts-ignore
                    setCurrentYear(clickedYear);
                })
                .on('mouseover', mousemove);;


            // Update the marker position
            if (currentYear && markerRef.current) {
                const markerXPosition = x(parseInt(currentYear));
                d3.select(markerRef.current).style('left', `${margin.left + markerXPosition - 4}px`);
            }

        }
    }, [carData, transportData, startYear, endYear, currentYear]);

    const calculatePercentageChange = (
        data: CarYearlyData | TransportYearlyData,
        metric: keyof CarData | keyof TransportData,
        startYear: string,
        endYear: string
    ) => {
        // Filter the data to include only the years within the startYear and endYear range
        const filteredData = Object.entries(data)
            .filter(([year]) => parseInt(year) >= parseInt(startYear) && parseInt(year) <= parseInt(endYear))
            .map(([year, dataArray]) => {
                const totalMetric = dataArray
                    // Filter out the 'FEDERAL' entry and sum up the metric for all other states
                    //@ts-ignore

                    .filter((d) => d.state !== 'FEDERAL')
                    //@ts-ignore

                    .reduce((acc, cur) => {
                        //@ts-ignore
                        return acc + cur[metric];
                    }, 0);
                return { year: parseInt(year), totalMetric };
            });

        // Ensure the data is sorted by year as filtering may disrupt the order
        filteredData.sort((a, b) => a.year - b.year);

        // Calculate the percentage change based on the first year's totalMetric
        const baseYearTotal = filteredData[0]?.totalMetric || 0;
        return filteredData.map((d) => ({
            year: d.year,
            percentageChange: baseYearTotal ? ((d.totalMetric - baseYearTotal) / baseYearTotal) * 100 : 0,
        }));
    };


    return (
        <Card>
            <div style={{ position: 'relative' }}>
                <svg
                    className="d3-component"
                    ref={d3Container}
                />
                {currentYear && (
                    <div
                        ref={markerRef}
                        style={{
                            position: 'absolute',
                            top: `${margin.top}px`,
                            height: `${height}px`,
                        }}
                        className={styles.timeLineMarker}
                    />
                )}
            </div>
        </Card>
    );
};

export default LineChartTS;