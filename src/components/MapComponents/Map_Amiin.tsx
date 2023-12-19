import { Card, Stack } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { TransportData, YearlyData } from '../../data/pTDataInterface';
import MapLegend from "./MapLegend";

interface Props {
    transportData: YearlyData;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC<Props> = ({ transportData }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [baseYear, setBaseYear] = useState("2013");
    const [comparisonYear, setComparisonYear] = useState("2014");
    const [selectedMetric, setSelectedMetric] = useState<keyof TransportData>('total_local_passengers');
    const [selectedState, setSelectedState] = useState(null);



    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!svgRef.current) return;

        // Mouseover event
        const handleMouseOver = (event: MouseEvent, d: any) => {
            const [x, y] = d3.pointer(event);
            setTooltipPosition({ x, y });
            setTooltipContent(d.properties.name); // Assuming 'name' is the property for the state name
            setTooltipVisible(true);
        };

        // Mouseout event
        const handleMouseOut = () => {
            setTooltipVisible(false);
        };

        //Color Mixer
        const colorScalePT = d3.scaleLinear<string>()
            .domain([-100, 0 , 100]) // Adjust domain as per your data range
            .range(['white', 'rgba(3, 4, 94, 0.5)', '#03045E']); // Change colors as needed

        const svg = d3.select(svgRef.current);

        // Define projection
        const projection = d3.geoMercator().fitSize([width, height], mapData);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Calculate color based on the change in total_local_passengers between baseYear and comparisonYear
        function calculateColor(stateId: string) {
            //console.log(`transportData Set:  ${transportData}`);
            //console.log(`Calculating color for state ${stateId} between ${baseYear} and ${comparisonYear}`);
            const baseYearData = transportData[baseYear].find(d => d.state === stateId);
            const comparisonYearData = transportData[comparisonYear].find(d => d.state === stateId);
            //const startYearData = transportData[baseYear].find(d => d.state === stateId);
            //const endYearData = transportData[comparisonYear].find(d => d.state === stateId);
            if (!baseYearData || !comparisonYearData) return 'rgba(3,4,94,0.92)'; // Standardfarbe

            const change = comparisonYearData.total_local_passengers - baseYearData.total_local_passengers;
            const maxChange = Math.max(...Object.values(transportData).flatMap(year => year.map(d => d.total_local_passengers)));
            const intensity = Math.abs(change) / maxChange;

            return d3.interpolateRgb('white', '#03045E')(intensity);
        }


        // Render the map
        svg
            .selectAll('path')
            .data(mapData.features)
            .join('path')
            .attr('d', (d) => pathGenerator(d) as string)
            // @ts-ignore
            .style('fill', (d) => calculateColor(d.properties.id))
            .style('stroke', 'black')
            .style('stroke-width', 1.5)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);



    }, [transportData, baseYear, comparisonYear]);



    const width = 500;
    const height = 600;

    return (
        <Card variant="outlined" sx={{ width: 650, height: 600 }}>
            <Stack direction="row">
                <Stack direction="column" paddingRight="25px">
                    <svg ref={svgRef} width={width} height={height}></svg>
                </Stack>
                <Stack direction="column">
                    <MapLegend isPT={true} paddingEnd={40}></MapLegend>
                    <MapLegend isPT={false} paddingEnd={0}></MapLegend>
                    <select value={baseYear} onChange={(e) => setBaseYear(e.target.value)}>
                        <option value="2013">2013</option>
                        {/* Add other years here */}
                    </select>
                    <select value={comparisonYear} onChange={(e) => setComparisonYear(e.target.value)}>
                        <option value="2014">2014</option>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        {/* Add other years here */}
                    </select>
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
                        borderRadius: '5px',
                        pointerEvents: 'none' // Important to not interfere with map interaction
                    }}
                >
                    {tooltipContent}
                </div>
            )}
        </Card>
    );
};

export default MapChart;
