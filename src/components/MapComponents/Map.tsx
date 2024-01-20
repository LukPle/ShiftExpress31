import { Card, Stack } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { TransportData, YearlyData } from '@/data/pTDataInterface';
import { PopulationData, YearlyData as PopulationYearlyData } from '@/data/populationInterface';
import MapLegend from "../KeyFindings/ChartLegendsAndTooltip/MapLegend";
import TextColumn from "../ProjectSection/TextColumn";

interface Props {
    data: YearlyData;
    populationData: PopulationYearlyData;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        // Define projection
        const projection = d3.geoMercator().fitSize([width, height], mapData);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        //Handling the mouse hover
        const handleMouseOver = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            setSelectedState(d.properties.name);
            d3.select(event.currentTarget as Element).style('fill', '#4748dc');
        };
        
        //Handling the mouse exit
        const handleMouseOut = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            setSelectedState(null);
            d3.select(event.currentTarget as Element).style('fill', 'rgba(3,4,94,0.92)');
        };

        // Sort Data




        // Render the map
        svg
            .selectAll('path')
            .data(mapData.features)
            .enter()
            .append('path')
            .attr('d', (d) => pathGenerator(d) as string)
            .style('fill', 'rgba(3,4,94,0.92)')
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    }, []);

    const width = 500;
    const height = 600;

    return (
        <Card variant="outlined" sx={{ width: 650, height: 600 }}>
            <Stack direction="row">
                <Stack direction="column" paddingRight="25px">
                    <svg ref={svgRef} width={width} height={height}></svg>
                    {selectedState && (
                        <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                            {selectedState}
                        </div>
                    )}
                </Stack>
                <Stack direction="column">
                    <MapLegend isPT={true} paddingEnd={40}></MapLegend>
                    <MapLegend isPT={false} paddingEnd={0}></MapLegend>
                </Stack>
            </Stack>
        </Card>
    );
};

export default MapChart;
