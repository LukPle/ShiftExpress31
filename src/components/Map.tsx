import { Card } from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../data/germany-states.json";
import React, { useEffect, useRef } from 'react';
import { FeatureCollection } from 'geojson';

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        // Define projection (you may need to adjust the parameters)
        const projection = d3.geoMercator().fitSize([width, height], mapData);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Render the map
        svg
            .selectAll('path')
            .data(mapData.features)
            .enter()
            .append('path')
            .attr('d', (d) => pathGenerator(d) as string)
            .style('fill', 'blue'); // Customize fill color as needed

    }, []);

    const width = 500; // Set your desired width
    const height = 600; // Set your desired height

    return (
        <Card variant="outlined" sx={{width: 500, height: 600}}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
            ></svg>
        </Card>
    );
};

export default MapChart;
