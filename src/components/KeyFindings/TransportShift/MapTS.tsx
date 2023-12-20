import { Select, Option, Stack } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../../../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import { CarData, YearlyData as CarYearlyData } from '../../../data/carDataInterface';
import { PopulationData } from '@/data/populationInterface';
import MapLegend from "@/components/MapComponents/MapLegend";
import SegmentedControlsFilter from "./SegmentedControlsFilter";

interface Props {
    transportData: TransportYearlyData;
    carData: CarYearlyData;
    endYear: string;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC<Props> = ({ transportData, carData, endYear}) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedMetricPT, setSelectedMetricPT] = useState<keyof TransportData>('total_local_passengers');
    const [selectedMetricCar, setSelectedMetricCar] = useState<keyof CarData>('passenger_km');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passengers');
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // Controlls which dataset is active
    const [isPT, setPT] = useState(true);


    // New state for tooltip position and content
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipContent, setTooltipContent] = useState('');


    const calculatePercentageChangePT = (state: string, metric: keyof TransportData) => {
        const startYearData = transportData[startYear].find(d => d.state === state);
        const endYearData = transportData[endYear].find(d => d.state === state);

        if (!startYearData || !endYearData) {
            return 0;
        }

        const startValue = startYearData[metric];
        const endValue = endYearData[metric];

        if (typeof startValue === 'number' && typeof endValue === 'number') {
            return ((endValue - startValue) / startValue) * 100;
        } else {
            return 0;
        }
    };

    const calculatePercentageChangeCar = (state: string, metric: keyof CarData) => {
        const startYearData = carData[startYear].find((d) => d.state === state);
        const endYearData = carData[endYear].find((d) => d.state === state);

        if (!startYearData || !endYearData) {
            return 0;
        }

        const startValue = startYearData[metric];
        const endValue = endYearData[metric];

        if (typeof startValue === 'number' && typeof endValue === 'number') {
            return ((endValue - startValue) / startValue) * 100;
        } else {
            return 0;
        }
    };

    const colorRange = isPT ? ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(3, 4, 94, 0.5)', '#03045E']
                            : ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(60, 27, 24, 0.5)', '#3C1B18'];

    const colorScale = d3.scaleLinear<string>()
    .domain([-40,-20,0, 20, 40]) // Adjust domain as per your data range
    .range(colorRange); // Change colors as needed

    const width = 300;
    const height = 450;

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        // Define projection
        const projection = d3.geoMercator().fitSize([width, height], mapData);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        /// Define the SVG pattern [OnHover]
        const pattern = svg
            .append('defs')
            .append('pattern')
            .attr('id', 'stripes-pattern')
            .attr('width', 4)
            .attr('height', 4)
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('patternTransform', 'rotate(45)');

        // Add a single diagonal line to the pattern
        pattern
            .append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 4)
            .attr('y2', 4)
            .attr('stroke', 'grey')
            .attr('stroke-width', 1);


        // Handling the mouse hover
        const handleMouseOver = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            const [x, y] = d3.pointer(event);
            const stateName = d.properties.name; // Assuming 'name' is the property for the state name
            const percentageChange = isPT ? calculatePercentageChangePT(d.properties.id, selectedMetricPT) : calculatePercentageChangeCar(d.properties.id, selectedMetricCar);
            const tooltipInfo = `${stateName}: ${percentageChange.toFixed(2)}% change`; // Formatting the tooltip content
            setTooltipPosition({ x, y });
            setTooltipContent(tooltipInfo); // Assuming 'name' is the property for the state name
            setTooltipVisible(true); // Show the tooltip
            d3.select(event.currentTarget as Element).style('fill', 'url(#stripes-pattern)');
        };

        // Handling the mouse exit
        const handleMouseOut = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            setTooltipVisible(false); // Hide the tooltip
            // @ts-ignore
            isPT ? d3.select(event.currentTarget as Element).style('fill', d => colorScale(calculatePercentageChangePT(d.properties.id, selectedMetricPT))) : d3.select(event.currentTarget as Element).style('fill', d => colorScale(calculatePercentageChangeCar(d.properties.id, selectedMetricCar)));
        };

        // Render the map
        svg.selectAll('path')
            .data(mapData.features)
            .join('path')
            .attr('d', d => pathGenerator(d) as string)
            // @ts-ignore
            .style('fill', d => colorScale(isPT ? calculatePercentageChangePT(d.properties.id, selectedMetricPT) : calculatePercentageChangeCar(d.properties.id, selectedMetricCar)))
            .style('stroke', '#9c9cb4')
            .style('stroke-width', 0.75)
            .on('mouseover',handleMouseOver)
            .on('mouseout',handleMouseOut);

    }, [startYear, endYear, selectedMetricPT, selectedMetricCar]);

    return (
        <>
        <SegmentedControlsFilter items={["Show Public Transport", "Show Cars"]} onChange={(index, item) => {setPT(index == 0); console.log(index, item);}}></SegmentedControlsFilter>
            <Stack direction={"row"}>
                <Select defaultValue="total_local_passengers"
                        sx={{minWidth: "250px", maxHeight: "30px", marginLeft: "10px"}}>
                    <Option value="total_local_passengers" onClick={() => setSelectedMetricPT('total_local_passengers')}>Total
                        Local Passengers</Option>
                    <Option value="total_local_passenger_km"
                            onClick={() => setSelectedMetricPT('total_local_passenger_km')}>Total Local Passenger
                        Km</Option>
                </Select>
            </Stack>
            <Stack direction="row">
                <Stack direction="column" paddingRight="35px">
                    <svg ref={svgRef} width={width} height={height}></svg>
                    {selectedState && (
                        <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                            {selectedState}
                        </div>
                    )}
                </Stack>
                <Stack direction="column">
                    <MapLegend isPT={isPT} paddingEnd={40}></MapLegend>
                </Stack>
            </Stack>
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
                        pointerEvents: 'none' // Important to not interfere with map interaction
                    }}
                >
                    {tooltipContent}
                </div>
            )}
        </>
    );
};

export default MapChart;