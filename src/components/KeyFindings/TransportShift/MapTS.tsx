import { Select, Option, Stack } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../../../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import { PopulationData } from '@/data/populationInterface';

interface Props {
    transportData: TransportYearlyData;
    endYear: string;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC<Props> = ({transportData, endYear}) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedMetric, setSelectedMetric] = useState<keyof TransportData>('total_local_passengers');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedTransportMetric, setSelectedTransportMetric] = useState<keyof TransportData>('total_local_passengers');

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

    const colorScale = d3.scaleLinear<string>()
        .domain([-15,0, 15]) // Adjust domain as per your data range
        .range(['#DD0606', 'white', '#03045E']); // Change colors as needed

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(tooltipRef.current);

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
            setSelectedState(d.properties.name);
            d3.select(event.currentTarget as Element).style('fill', 'url(#stripes-pattern)');
        };

        // Handling the mouse exit
        const handleMouseOut = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            setSelectedState(null);
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
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .on('mouseover',handleMouseOver)
            .on('mouseout',handleMouseOut);

    }, [startYear, endYear, selectedMetric]);

    const width = 300;
    const height = 450;

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
            <div ref={tooltipRef} style={{
                position: 'absolute',
                visibility: 'hidden',
                background: '#fff',
                padding: '5px',
                border: '1px solid #000'
            }}></div>
            <Stack direction="row">
                <Stack direction="column" paddingRight="25px">
                    <svg ref={svgRef} width={width} height={height}></svg>
                    {selectedState && (
                        <div style={{position: 'absolute', pointerEvents: 'none'}}>
                            {selectedState}
                        </div>
                    )}
                </Stack>
            </Stack>
        </>
    );
};

export default MapChart;