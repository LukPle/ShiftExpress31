import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, useAnimation } from 'framer-motion';
import { YearlyData as CarYearlyData, CarData } from '@/data/carDataInterface';
import { YearlyData as TransportYearlyData, TransportData } from '@/data/pTDataInterface';
import styles from "@/styles/charts.module.css";
import { FilterOptions } from './Cars';
import ChartTooltip from '../ChartLegendsAndTooltip/ChartTooltip';


interface LineChartCombinedProps {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    startYear: string;
    endYear: string;
    currentYear: string;
    setCurrentYear: (year: string) => void;
    currentFilter: FilterOptions;
}

const LineChartTS: React.FC<LineChartCombinedProps> = ({ carData, transportData, startYear, endYear, currentYear, setCurrentYear, currentFilter }) => {
    const d3Container = useRef(null);
    const margin = { top: 10, right: 20, bottom: 20, left: 30 };
    const width = 820 - margin.left - margin.right;
    const height = 125 - margin.top - margin.bottom;

    const markerRef = useRef(null);
    const controls = useAnimation(); // Create animation controls

    const [tooltip, setTooltip] = useState({
        visible: false,
        position: { x: 0, y: 0 },
        state: '',
        content: <></>,
    });

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

            const y = d3
                .scaleLinear()
                .domain([
                    Math.min(d3.min(carPercentageChangeData, (d) => d.percentageChange) as number, d3.min(transportPercentageChangeData, (d) => d.percentageChange) as number),
                    Math.max(d3.max(carPercentageChangeData, (d) => d.percentageChange) as number, d3.max(transportPercentageChangeData, (d) => d.percentageChange) as number)
                ])
                .range([height, 0]);

            // Specify the tick values you want (2, 4, 6, 8 in this case)
            const tickValues = [2, 4, 6, 8];

            // Create a custom tick format function to add "%" symbol
            //@ts-ignore
            const tickFormat = (d) => d;

            // Apply the custom tick values and format to the y-axis
            const yAxis = d3.axisLeft(y)
                .tickValues(tickValues)
                .tickFormat(tickFormat);

            // Append the y-axis to your chart
            svg.append("g")
                .attr("class", "y-axis")
                .call(yAxis)
                .selectAll('text')
                .style('font-size', '15px')
                .style("font-weight", "300");

            // Scales
            const x = d3
                .scaleLinear()
                .domain(d3.extent(carPercentageChangeData, (d) => d.year) as [number, number])
                .range([0, width]);

            // X axis
            const allYears = carPercentageChangeData.map(d => d.year); // Assuming this is an array of all years you have data for.
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .tickValues(allYears) // Set the tick values to the years from your data
                    .tickFormat(d3.format('d'))) // Format ticks as integers without comma separators
                .selectAll('text')
                .style('font-size', '15px')
                .style("font-weight", "550");


            // Draw horizontal lines at specified values
            //TODO: Build reference lines based on max / min values of dataset props
            const referenceLines = [2, 4, 6, 8];
            svg.selectAll(".reference-line")
                .data(referenceLines)
                .enter().append("line")
                .attr("class", "reference-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "#ddd") // Light grey color
                // @ts-ignore
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "3,4"); // Dashed line style

            // Car Data Line
            svg
                .append('path')
                .datum(carPercentageChangeData)
                .attr('fill', 'none')
                .attr('stroke', (currentFilter !== FilterOptions.FocusPublicTransport) ? '#FFA500' : '#E8E8E8')
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
                .attr('stroke', (currentFilter !== FilterOptions.FocusCars) ? '#9BC4FD' : '#E8E8E8')
                .attr('stroke-width', 5)
                .attr(
                    'd',
                    d3
                        .line<any>()
                        .x((d) => x(d.year))
                        .y((d) => y(d.percentageChange))
                );

            // Car Data Circles
            svg.selectAll(".car-circle")
            .data(carPercentageChangeData)
            .enter().append("circle")
            .attr("class", "car-circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.percentageChange))
            .attr("r", 5) // Adjust the radius as needed
            .style('fill', (currentFilter !== FilterOptions.FocusPublicTransport) ? '#FFA500' : '#E8E8E8');

            // Transport Data Circles
            svg.selectAll(".transport-circle")
            .data(transportPercentageChangeData)
            .enter().append("circle")
            .attr("class", "transport-circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.percentageChange))
            .attr("r", 5) // Adjust the radius as needed
            .style('fill', (currentFilter !== FilterOptions.FocusCars) ? '#9BC4FD' : '#E8E8E8');

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
                .style('fill', (currentFilter !== FilterOptions.FocusPublicTransport) ? '#FFA500' : '#E8E8E8')
                .attr('r', 7)
                .style('display', 'none');

            const focusTransport = svg.append('g')
                .append('circle')
                .style('fill', (currentFilter !== FilterOptions.FocusCars) ? '#9BC4FD' : '#E8E8E8')
                .attr('r', 7)
                .style('display', 'none');

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

                setTooltip({
                    visible: true,
                    position: { x: x(selectedDataCar.year) + margin.left + 20, y: y(selectedDataCar.percentageChange) + margin.top - 35 },
                    state: "Germany",
                    content: (
                        <>
                            🚗 {selectedDataCar.percentageChange.toFixed(2)}% change
                            <br />
                            🚊 {selectedDataTransport.percentageChange.toFixed(2)}% change
                        </>
                    ),
                });

                overlay.style('cursor', 'pointer');
            };

            // Event listeners for the overlay for tooltip
            overlay
                .on('mouseover', () => {
                    focusCar.style('display', null);
                    focusTransport.style('display', null);
                })
                .on('mouseout', () => {
                    focusCar.style('display', 'none');
                    focusTransport.style('display', 'none');
                    overlay.style('cursor', 'default');

                    setTooltip((prevTooltip) => ({
                        ...prevTooltip,
                        visible: false,
                    }));
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
                //d3.select(markerRef.current).style('left', `${margin.left + markerXPosition - 4}px`);
                const targetLeft = margin.left + markerXPosition - 4;
                const animation = {
                    left: targetLeft,
                    transition: { type: 'tween', duration: 2 },
                };
                controls.start(animation);
            }

        }
    }, [carData, transportData, startYear, endYear, currentYear, controls, currentFilter]);

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
        <div>
            <div style={{ position: 'relative' }}>
                <svg
                    className="d3-component"
                    ref={d3Container}
                />
                {currentYear && (
                    <motion.div
                        ref={markerRef}
                        style={{
                            position: 'absolute',
                            top: `${margin.top}px`,
                            height: `${height}px`,
                        }}
                            animate={controls}
                        className={styles.timeLineMarker}
                    >
                    </motion.div>
                )}
                {/* Display Tooltip */}
                {tooltip.visible && (
                    <ChartTooltip
                        tooltipPosition={tooltip.position}
                        tooltipState={tooltip.state}
                        tooltipContent={tooltip.content}
                    />
                )}
            </div>
        </div>

    );
};

export default LineChartTS;