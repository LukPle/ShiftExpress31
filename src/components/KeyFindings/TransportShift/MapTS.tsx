import { Select, Option, Stack } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../../../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import { PopulationData } from '@/data/populationInterface';
import MapLegend from "@/components/MapComponents/MapLegend";
import Button from "@mui/material/Button";
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import Tooltip from "@mui/material/Tooltip/Tooltip";

interface Props {
    isPT: boolean;
    transportData: TransportYearlyData;
    endYear: string;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC<Props> = ({isPT, transportData, endYear}) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedMetric, setSelectedMetric] = useState<keyof TransportData>('total_local_passengers');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passengers');
    const [clickedState, setClickedState] = useState<string | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);


    // Tooltip-Element
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const calculatePercentageChange = (state: string, metric: keyof TransportData) => {
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
            d3.select(event.currentTarget as Element).style('fill', 'url(#stripes-pattern)');
        };

        // Handling the mouse exit
        const handleMouseOut = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            // @ts-ignore
            d3.select(event.currentTarget as Element).style('fill', d => colorScale(calculatePercentageChange(d.properties.id, selectedMetric)));
        };

        // Render the map
        svg.selectAll('path')
            .data(mapData.features)
            .join('path')
            .attr('d', d => pathGenerator(d) as string)
            // @ts-ignore
            .style('fill', d => colorScale(calculatePercentageChange(d.properties.id, selectedMetric)))
            .style('stroke', '#9c9cb4')
            .style('stroke-width', 0.75)
            .on('mouseover',handleMouseOver)
            .on('mouseout',handleMouseOut);

    }, [startYear, endYear, selectedMetric]);

    return (
        <>
            <Stack direction={"row"}>
                <Select defaultValue="total_local_passengers"
                        sx={{minWidth: "250px", maxHeight: "30px", marginLeft: "10px"}}>
                    <Option value="total_local_passengers" onClick={() => setSelectedMetric('total_local_passengers')}>Total
                        Local Passengers</Option>
                    <Option value="total_local_passenger_km"
                            onClick={() => setSelectedMetric('total_local_passenger_km')}>Total Local Passenger
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
        </>
    );
};

export default MapChart;