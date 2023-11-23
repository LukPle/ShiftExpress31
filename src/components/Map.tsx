import { Card } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';

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

        //Handels the mouse hover
        const handleMouseOver = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            setSelectedState(d.properties.name);
            d3.select(event.currentTarget as Element).style('fill', 'lightblue');
        };
        
        //Handels the mouse exit
        const handleMouseOut = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
            setSelectedState(null);
            d3.select(event.currentTarget as Element).style('fill', 'blue');
        };        

        // Render the map
        svg
            .selectAll('path')
            .data(mapData.features)
            .enter()
            .append('path')
            .attr('d', (d) => pathGenerator(d) as string)
            .style('fill', 'blue')
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    }, []);

    const width = 500;
    const height = 600;

    return (
        <Card variant="outlined" sx={{ width: 500, height: 600 }}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
            ></svg>
            {selectedState && (
                <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                    {selectedState}
                </div>
            )}
        </Card>
    );
};

export default MapChart;
