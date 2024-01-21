import { Select, Option, Stack, CardOverflow, CardContent, Divider, Typography} from "@mui/joy";
import * as d3 from "d3";
import germanyGeoJSON from "../../../data/germany-states.json";
import React, { useEffect, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { TransportData, YearlyData as TransportYearlyData } from '../../../data/pTDataInterface';
import { PopulationData, YearlyData as PopulationYearlyData } from '../../../data/populationInterface';
import { CarData, YearlyData as CarYearlyData } from '../../../data/carDataInterface';
import MapLegend from "@/components/KeyFindings/ChartLegendsAndTooltip/MapLegend";
import SegmentedControlsFilter from "../SegmentedControlsFilter";
import ChartTooltip from "../ChartLegendsAndTooltip/ChartTooltip";
import { FilterOptions } from "./Cars";
import { motion } from "framer-motion";


interface Props {
    transportData: TransportYearlyData;
    carData: CarYearlyData;
    endYear: string;
    currentFilter: FilterOptions;
    populationData: PopulationYearlyData;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC<Props> = ({ transportData, carData, endYear, currentFilter, populationData }) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedMetricPT, setSelectedMetricPT] = useState<keyof TransportData>('total_local_passenger_km');
    const [selectedMetricCar, setSelectedMetricCar] = useState<keyof CarData>('passenger_km');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedState, setSelectedState] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // Controlls which dataset is active
    const [isPT, setPT] = useState(true);
    const [isPC, setPC] = useState(false);

    const width = 300;
    const [height, setHeight] = useState(currentFilter == FilterOptions.CarsAbs ? 380 : 440);

    switch(currentFilter) {
        case FilterOptions.CarsAbs:
            if(isPT === true) {
              setPT(false);
            }
            if (height != 380) {
              setHeight(380);
            }
            break;
        case FilterOptions.Comparison:
            if(isPC === true) {
              setPC(false);
            }
            if (height != 440) {
              setHeight(440);
            }
            break;  
        case FilterOptions.CarsDev:
            if(isPT === true) {
              setPT(false);
            }
            if (height != 440) {
              setHeight(440);
            }
            break;
        default:
            console.log(`Got ${currentFilter} but expected CarsAbs, Comparison or CarsDev`);
    }


    // New state for tooltip position and content
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipState, setTooltipState] = useState('');
    const [tooltipContent, setTooltipContent] = useState('');

    // Function to calculate absolute car usage in billion pass. km
    const calculateCarAbsBil = (state: string, metric: keyof CarData) => {
      const yearData = carData[endYear].find(d => d.state === state);
      const yearDataMetric = yearData?.[metric] ?? 0;

      if (isPC) {
        const yearPopData = populationData[endYear].find(d => d.state === state)?.population ?? 0;
        return typeof yearDataMetric === 'number' ?  yearDataMetric / yearPopData : 0;
      } else {
        return typeof yearDataMetric === 'number' ?  yearDataMetric / 1000000000 : 0;
      }
    }

    // Function to calculate absolute PT usage in billion pass. km
    const calculatePTAbsBil = (state: string, metric: keyof TransportData) => {
      const yearData = transportData[endYear].find(d => d.state === state);
      const yearDataMetric = yearData?.[metric] ?? 0;

      if (isPC) {
        const yearPopData = populationData[endYear].find(d => d.state === state)?.population ?? 0;
        return typeof yearDataMetric === 'number' ?  yearDataMetric / yearPopData : 0;
      } else {
        return typeof yearDataMetric === 'number' ?  yearDataMetric / 1000000000 : 0;
      }
    }

    // Function to calculate percentage change for a state in current time span
    const calculatePercentageChange = (stateId: string, metric: keyof TransportData | keyof CarData, data: TransportYearlyData | CarYearlyData) => {
        const startYearData = data[startYear].find(d => d.state === stateId);
        const endYearData = data[endYear].find(d => d.state === stateId);
    
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
    
    // Function to get the top 3 states based on percentage change
    const getTop3States = (metric: keyof TransportData | keyof CarData, data: TransportYearlyData | CarYearlyData) => {
      const stateTopValueList = mapData.features.map((feature) => {
        // @ts-ignore
        const stateId = feature.properties.id;
        // @ts-ignore
        const stateName = feature.properties.name;

        const value = calculatePercentageChange(stateId, metric, data);
        return { stateName, value };
      });
          
      // Sort states based on percentage change in descending order
      const sortedStates = stateTopValueList.sort((a, b) => b.value - a.value);
  
      // Get the top 3 states
      const top3States = sortedStates.slice(0, 3);
  
      return top3States;
    };    
    
    // Function to get the top 3 states based on percentage change
    const getTop3StatesCarAbs = (metric: keyof CarData, data: CarYearlyData) => {
      const stateTopValueList = mapData.features.map((feature) => {
        // @ts-ignore
        const stateId = feature.properties.id;
        // @ts-ignore
        const stateName = feature.properties.name;

        const value = calculateCarAbsBil(stateId, metric);
        return { stateName, value };
      });
    
      // Sort states based on percentage change in descending order
      const sortedStates = stateTopValueList.sort((a, b) => b.value - a.value);
  
      // Get the top 3 states
      const top3States = sortedStates.slice(0, 3);
  
      return top3States;
    };    

    const colorRangeAbs = isPT ? ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(155, 196, 253, 0.5)', '#9BC4FD'] 
                               : ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(255, 165, 0, 0.5)', '#FFA500'];      
    const colorRange = isPT ? ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(155, 196, 253, 0.5)', '#9BC4FD']
                            : ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(255, 165, 0, 0.5)', '#FFA500'];

                            
    const colorScaleAbs = d3.scaleLinear<string>()
      .domain(isPC ? [-3000, 500, 4000, 7500, 11000] : (isPT ? [-40, -20, 0, 20, 40] : [-200, -100, 0, 100, 200]))
      .range(colorRangeAbs);    
    const colorScale = d3.scaleLinear<string>()
      .domain(isPT ? [-40, -20, 0, 20, 40] : [-10, -5, 0, 5, 10])
      .range(colorRange);
                            
    // Handling the mouse hover
    const handleMouseOver = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
        const [x, y] = d3.pointer(event);
        const stateName = d.properties.name; // Assuming 'name' is the property for the state name
        setTooltipState(stateName);

        let tooltipContent = "";

        switch(currentFilter) {
          case FilterOptions.CarsAbs:
          default:
            tooltipContent = isPC ? `${calculateCarAbsBil(d.properties.id, selectedMetricCar).toFixed(0)} km pc` : `${calculateCarAbsBil(d.properties.id, selectedMetricCar).toFixed(2)} bil. passenger km`;
            break;
          case FilterOptions.Comparison:
            tooltipContent = isPT ? `${calculatePTAbsBil(d.properties.id, selectedMetricPT).toFixed(2)} bil. passenger km` : `${calculateCarAbsBil(d.properties.id, selectedMetricCar).toFixed(2)} bil. passenger km`;
            break;  
          case FilterOptions.CarsDev:
            tooltipContent = `${calculatePercentageChange(d.properties.id, selectedMetricCar, carData).toFixed(2)} % change`;
            break;
        }

        setTooltipPosition({ x, y });
        setTooltipContent(tooltipContent);
        setTooltipVisible(true); // Show the tooltip
        d3.select(event.currentTarget as Element).style('fill', 'url(#stripes-pattern)');
    };

    // Handling the mouse exit
    const handleMouseOut = (event: React.MouseEvent<SVGPathElement, MouseEvent>, d: any) => {
        setTooltipVisible(false); // Hide the tooltip
        
        switch(currentFilter) {
          case FilterOptions.CarsAbs:
          default:
            // @ts-ignore
            d3.select(event.currentTarget as Element).style('fill', d => colorScaleAbs(calculateCarAbsBil(d.properties.id, selectedMetricCar)));
            break;
          case FilterOptions.Comparison:
            // @ts-ignore
            d3.select(event.currentTarget as Element).style('fill', d => colorScaleAbs(isPT ? calculatePTAbsBil(d.properties.id, selectedMetricPT) : calculateCarAbsBil(d.properties.id, selectedMetricCar)));
            break;  
          case FilterOptions.CarsDev:
            // @ts-ignore
            d3.select(event.currentTarget as Element).style('fill', d => colorScale(calculatePercentageChange(d.properties.id, selectedMetricCar, carData)));
            break;
        }
    };
    

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        // Define projection
        const projection = d3.geoMercator().fitSize([width, height], mapData);

        // Create a path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Define the SVG pattern [OnHover]
        const pattern = svg
            .append('defs')
            .append('pattern')
            .attr('id', 'stripes-pattern')
            .attr('width', 8) // Adjust the width to control the density of stripes
            .attr('height', 8) // Adjust the height to control the density of stripes
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('patternTransform', 'rotate(45)');


        // Add alternating diagonal lines and transparent rectangles to the pattern
        pattern
            .selectAll('rect')
            .data([
                { x: 0, y: 0, width: 2, height: 8, fill: 'grey' },
            ])
            .enter()
            .append('rect')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', d => d.fill);
        
        // Render the map
        const getMapData = (d: any) => {
          switch(currentFilter) {
            case FilterOptions.CarsAbs:
            default:
              return colorScaleAbs(calculateCarAbsBil(d.properties?.id, selectedMetricCar))
            case FilterOptions.Comparison:
              return colorScaleAbs(isPT ? calculatePTAbsBil(d.properties?.id, selectedMetricPT) : calculateCarAbsBil(d.properties?.id, selectedMetricCar))
            case FilterOptions.CarsDev:
              return colorScale(calculatePercentageChange(d.properties?.id, selectedMetricCar, carData))
          }        
        }        
        svg.selectAll('path')
            .data(mapData.features)
            .join('path')
            .attr('d', d => pathGenerator(d) as string)
            .style('fill', d => getMapData(d))
            .style('stroke', '#727272')
            .style('stroke-width', 0.75)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

    }, [startYear, endYear, selectedMetricPT, selectedMetricCar, isPT, isPC, currentFilter]);

    const top3StatesCar = getTop3States(selectedMetricCar, carData);
    const top3StatesCarAbs = getTop3StatesCarAbs(selectedMetricCar, carData);    

    return (
        <>
            <CardOverflow>
                {(currentFilter === FilterOptions.Comparison) ? (
                  <>
                    <SegmentedControlsFilter items={["Show Public Transport", "Show Cars"]} onChange={(index, item) => setPT(index === 0)} />
                    <Divider inset="context" />
                  </>
                ) : (
                  (currentFilter === FilterOptions.CarsAbs) ? (
                    <div style={{ height: '120px' }}>
                        <Stack direction={'column'} divider={<Divider orientation='horizontal' />} gap={0.2}>
                        <SegmentedControlsFilter items={["Absolute data", "Per capita"]} onChange={(index, item) => setPC(index === 1)} />
                            {top3StatesCarAbs.map((stateData, index) => (
                              <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                  <Typography>
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {stateData.stateName} - {isPC ? stateData.value.toFixed(0) : stateData.value.toFixed(2)} {isPC ? "km pc." : "bil. pass. km"}
                                  </Typography>
                              </motion.div>
                            ))}
                        </Stack>
                    </div>
                  ) : (
                    <div style={{ height: '60px' }}>
                        <Stack direction={'column'} divider={<Divider orientation='horizontal' />} gap={0.2}>
                            {top3StatesCar.map((stateData, index) => (
                              <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                  <Typography>
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {stateData.stateName} - {stateData.value.toFixed(2)} %
                                  </Typography>
                              </motion.div>
                            ))}
                        </Stack>
                    </div>
                  )
                )}
            </CardOverflow>

            <Stack direction="row" marginTop="20px" alignItems={"center"} justifyContent={"center"}>
              <Stack direction="column">
                  <svg ref={svgRef} width={width} height={height}></svg>
                  {selectedState && (
                      <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                          {selectedState}
                      </div>
                  )}
              </Stack>

              {(currentFilter === FilterOptions.Comparison) ? (
                <Stack direction="column" width={"100px"} paddingLeft="35px" >
                  <MapLegend 
                    paddingEnd={40} 
                    tooltip={`Color Scale for ${isPT ? 'Public Transport' : 'Cars'}`} 
                    headline={isPT ? "🚊 Billion passenger km" : "🚗 Billion passenger km"}
                    scale={isPT 
                      ? [{text: "40", color: "#9BC4FD"}, {text: "20", color: "rgba(155, 196, 253, 0.5)"}, {text: "0", color: "#FFFFFF"}] 
                      : [{text: "200", color: "#FFA500"}, {text: "100", color: "rgba(255, 165, 0, 0.5)"}, {text: "0", color: "#FFFFFF"}]}
                  ></MapLegend>
                </Stack>
              ) : ((currentFilter === FilterOptions.CarsDev) ? (
                <Stack direction="column" width={"100px"} paddingLeft="35px" >
                  <MapLegend 
                    paddingEnd={40} 
                    tooltip="Color Scale for Cars" 
                    headline="🚗 Change of usage in %"
                    scale={[{text: "10", color: "#FFA500"}, {text: "5", color: "rgba(255, 165, 0, 0.5)"}, {text: "0", color: "#FFFFFF"}, {text: "-5", color: "rgba(221, 6, 6, 0.5)"}, {text: "-10", color: "#DD0606"}]}
                  ></MapLegend>
                </Stack>
              ) : <></>)}
            </Stack>

            {tooltipVisible && (
                <ChartTooltip tooltipPosition={tooltipPosition} tooltipState={tooltipState} tooltipContent={tooltipContent}></ChartTooltip>
            )}
        </>
    );
};

export default MapChart;