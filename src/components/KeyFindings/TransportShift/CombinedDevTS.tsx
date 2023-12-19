import { Select, Option, Stack, Typography, Badge } from "@mui/joy";
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CarData, YearlyData as CarYearlyData } from '../../../data/carDataInterface';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import GroupedBarChartLegend from "./GroupedBarChartLegend";

interface Props {
    carData: CarYearlyData;
    transportData: TransportYearlyData;
    endYear: string;
}

const CombinedDevTS: React.FC<Props> = ({ carData, transportData, endYear }) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedCarMetric, setSelectedCarMetric] = useState<keyof CarData>('passenger_km');
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passengers');
    const d3Container = useRef<SVGSVGElement | null>(null);

    // Tooltip
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const GERMAN_STATES = {
        'BW': 'Baden-Württemberg',
        'BY': 'Bayern',
        'BE': 'Berlin',
        'BB': 'Brandenburg',
        'HB': 'Bremen',
        'HH': 'Hamburg',
        'HE': 'Hesse',
        'MV': 'Mecklenburg-Vorpommern',
        'NI': 'Niedersachsen',
        'NW': 'Nordrhein-Westfalen',
        'RP': 'Rheinland-Pfalz',
        'SL': 'Saarland',
        'SN': 'Sachsen',
        'ST': 'Sachsen-Anhalt',
        'SH': 'Schleswig-Holstein',
        'TH': 'Thüringen'
    };

    const calculatePercentageChange = (data: CarYearlyData | TransportYearlyData, state: string, metric: keyof CarData | keyof TransportData) => {
        const startYearData = data[startYear].find(d => d.state === state);
        const endYearData = data[endYear].find(d => d.state === state);

        if (!startYearData || !endYearData) {
            return 0;
        }
        // @ts-ignore
        const startValue = startYearData[metric];
        // @ts-ignore
        const endValue = endYearData[metric];

        if (typeof startValue === 'number' && typeof endValue === 'number') {
            return ((endValue - startValue) / startValue) * 100;
        } else {
            return 0;
        }
    };

    // @ts-ignore
    useEffect(() => {
        if (carData && transportData && d3Container.current) {
            d3.select(d3Container.current).selectAll("*").remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 30 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Gather unique states from both datasets
            let allStates = new Set<string>();
            [carData, transportData].forEach(dataset => {
                Object.values(dataset).flat().forEach(entry => {
                    if (entry.state !== "FEDERAL") {
                        allStates.add(entry.state);
                    }
                });
            });

            let combinedPercentageChanges = Array.from(allStates).map(state => {
                const carChange = calculatePercentageChange(carData, state, selectedCarMetric);
                const transportChange = calculatePercentageChange(transportData, state, selectedTransportMetric);

                console.log(carChange, transportChange);

                return {
                    state,
                    carChange,
                    transportChange,
                    averageChange: (carChange + transportChange) / 2
                };
            });

            // Filter out 'federal' data
            combinedPercentageChanges = combinedPercentageChanges.filter(d => d.state !== 'FEDERAL');

            const x0 = d3.scaleBand()
                .range([0, width])
                .paddingInner(0.1)
                .domain(allStates);

            const x1 = d3.scaleBand()
                .padding(0.05)
                .domain(['transportData', 'carData'])
                .rangeRound([0, x0.bandwidth()]);

            const color = d3.scaleOrdinal().range(["rgba(60, 27, 24, 0.5)", "#03045E"]);
            
            // Find the maximum absolute percentage change for both datasets
            const maxCarChange = d3.max(combinedPercentageChanges, d => Math.abs(d.carChange)) as number;
            const maxTransportChange = d3.max(combinedPercentageChanges, d => Math.abs(d.transportChange)) as number;
            const maxChange = Math.max(maxCarChange, maxTransportChange);


            // Define the y-scales with fixed domain extent
            const yCar = d3.scaleLinear()
            .range([height, 0])
            .domain([-50, 50])
            .nice();

            const yTransport = d3.scaleLinear()
            .range([height, 0])
            .domain([-50, 50])
            .nice();


            // Create the axes
            const yAxisLeft = d3.axisLeft(yCar);
            const yAxisRight = d3.axisRight(yTransport);

            // Append the axes to the SVG
            svg.append("g")
                .attr("class", "y axis left")
                .call(yAxisLeft)
                .selectAll("text") // Selecting all text elements within the axis
                .style("font-size", "13px"); // Set the font size

            // Draw horizontal lines at specified values
            const referenceLines = [-40, -20, 20, 40];


            svg.selectAll(".reference-line")
                .data(referenceLines)
                .enter().append("line")
                .attr("class", "reference-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => yCar(d))
                .attr("y2", d => yCar(d))
                .attr("stroke", "#ddd") // Light grey color
                // @ts-ignore
                .attr("stroke-width", 2.5)
                .attr("stroke-dasharray", "3,3"); // Dashed line style

            // Append the axes to the SVG
            svg.append("g")
                .attr("class", "y axis left")
                .call(yAxisLeft)
                .selectAll("text") // Selecting all text elements within the axis
                .style("font-size", "13px"); // Set the font size
            

            // Draw the bars for CarData

            svg.selectAll(".bar.car")
                .data(combinedPercentageChanges)
                .enter().append("rect")
                .attr("class", "bar car")
                // @ts-ignore
                .attr("x", d => x0(d.state))
                .attr("width", x1.bandwidth())
                .attr("y", d => yCar(Math.max(0, d.carChange)))
                .attr("height", d => Math.abs(yCar(d.carChange) - yCar(0)))
                .attr("fill", color('carData'))
                .on("mouseover", (event, d) => {
                    const [x, y] = d3.pointer(event);
                    const stateFullName = GERMAN_STATES[d.state] || d.state; // Use full name if available, else use the abbreviation
                    setTooltipPosition({ x, y });
                    setTooltipContent(`${stateFullName}: ${d.carChange.toFixed(2)}%`);
                    setTooltipVisible(true);
                })
                // @ts-ignore
                .on("mouseout", () => setTooltipVisible(false));

            // Draw the bars for TransportData
            svg.selectAll(".bar.transport")
                .data(combinedPercentageChanges)
                .enter().append("rect")
                .attr("class", "bar transport")
                // @ts-ignore
                .attr("x", d => x0(d.state) + x1.bandwidth())
                .attr("width", x1.bandwidth())
                .attr("y", d => yTransport(Math.max(0, d.transportChange)))
                .attr("height", d => Math.abs(yTransport(d.transportChange) - yTransport(0)))
                .attr("fill", color('transportData'))
                .on("mouseover", (event, d) => {
                    const [x, y] = d3.pointer(event);
                    const stateFullName = GERMAN_STATES[d.state] || d.state; // Use full name if available, else use the abbreviation
                    setTooltipPosition({ x, y });
                    setTooltipContent(`${stateFullName}: ${d.transportChange.toFixed(2)}%`);
                    setTooltipVisible(true);
                })
                .on("mouseout", () => setTooltipVisible(false));

            // Add the x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${yCar(0)})`)
                .call(d3.axisBottom(x0));
        }
    }, [carData, transportData, startYear, endYear, selectedCarMetric, selectedTransportMetric]);

    return (
        <div>
            <Stack direction={"row"}>
                <Stack gap={"5px"} ml={3}>
                    <Stack direction={"row"} gap={"5px"}>
                        <Typography pt={"5px"}>Car Dataset:</Typography>
                        {/* @ts-ignore */}
                        <Badge color="cars">
                            <Select defaultValue="passenger_km" sx={{ minWidth: "250px", maxHeight: "30px", marginLeft: "10px" }}>
                                <Option value="passenger_km" onClick={() => setSelectedCarMetric('passenger_km')}>Total Passenger KMs</Option>
                                <Option value="per_car_km" onClick={() => setSelectedCarMetric('per_car_km')}>Per Car Km</Option>
                                <Option value="per_car_pass_km" onClick={() => setSelectedCarMetric('per_car_pass_km')}>Per Car Passenger Km</Option>
                                <Option value="cars" onClick={() => setSelectedCarMetric('cars')}>Number of Cars</Option>
                            </Select>
                        </Badge>
                    </Stack>
                    <Stack direction={"row"} gap={"5px"}>
                        <Typography pt={"5px"}>Public Transport Dataset:</Typography>
                        {/* @ts-ignore */}
                        <Badge color="pT">
                            <Select defaultValue="total_local_passengers" sx={{ minWidth: "250px", maxHeight: "30px", marginLeft: "10px" }}>
                                <Option value="total_local_passengers" onClick={() => setSelectedTransportMetric('total_local_passengers')}>Total Local Passengers</Option>
                                <Option value="total_local_passenger_km" onClick={() => setSelectedTransportMetric('total_local_passenger_km')}>Total Local Passenger Km</Option>
                            </Select>
                        </Badge>
                    </Stack>
                </Stack>
            </Stack>
            <svg ref={d3Container} />
            <GroupedBarChartLegend></GroupedBarChartLegend>
            {tooltipVisible && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        backgroundColor: 'white',
                        padding: '5px',
                        border: '1px solid black',
                        borderRadius: '10px',
                        pointerEvents: 'none' // Important to not interfere with bar chart interaction
                    }}
                >
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default CombinedDevTS;
