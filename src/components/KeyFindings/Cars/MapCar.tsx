import { Select, Option, Stack, CardOverflow, CardContent, Divider, Typography, Button} from "@mui/joy";
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
import { Map, Sort } from "@mui/icons-material";


interface Props {
    transportData: TransportYearlyData;
    carData: CarYearlyData;
    endYear: string;
    currentFilter: FilterOptions;
    populationData: PopulationYearlyData;
    onStateHover: (stateId: string | null) => void;
    selectedState: string | null;
}

const mapData: FeatureCollection = germanyGeoJSON as FeatureCollection;

const MapChart: React.FC<Props> = ({ transportData, carData, endYear, currentFilter, onStateHover, selectedState, populationData }) => {
    const [startYear, setStartYear] = useState<string>('2013');
    const [selectedMetricPT, setSelectedMetricPT] = useState<keyof TransportData>('total_local_passenger_km');
    const [selectedMetricCar, setSelectedMetricCar] = useState<keyof CarData>('passenger_km');
    const svgRef = useRef<SVGSVGElement | null>(null);
    // const [selectedState, setSelectedState] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // Controlls which dataset is active
    const [isPT, setPT] = useState(true);
    const [isPC, setPC] = useState(false);

    const [rankingVisible, setRankingVisibility] = useState(false);

    const handleRankingVisibility = () => {
      if (currentFilter != FilterOptions.CarsDev) {
        if (rankingVisible) {
          setRankingVisibility(false);
        } else {
        setRankingVisibility(true);
       }
      }
    }

    const width = 300;
    const [height, setHeight] = useState(currentFilter != FilterOptions.CarsDev ? 395 : 430);

    switch(currentFilter) {
        case FilterOptions.CarsAbs:
            if(isPT === true) {
              setPT(false);
            }
            if (height != 395) {
              setHeight(395);
            }
            break;
        case FilterOptions.Comparison:
            if(isPC === true) {
              setPC(false);
            }
            if (height != 395) {
              setHeight(395);
            }
            break;  
        case FilterOptions.CarsDev:
            if(isPT === true) {
              setPT(false);
            }
            if (height != 430) {
              setHeight(430);
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
    
    // Function to get the top 10 states based on absolute data
    const getTop10CarAbs = (metric: keyof CarData, data: CarYearlyData) => {
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

      // Get the top 10 states
      const top10States = sortedStates.slice(0, 10);
  
      return top10States;
    };

    // Function to get the top 10 states based on absolute PT data
    const getTop10PTAbs = (metric: keyof TransportData, data: TransportYearlyData) => {
      const stateTopValueList = mapData.features.map((feature) => {
        // @ts-ignore
        const stateId = feature.properties.id;
        // @ts-ignore
        const stateName = feature.properties.name;

        const value = calculatePTAbsBil(stateId, metric);
        return { stateName, value };
      });

      // Sort states based on absolute PT data in descending order
      const sortedStates = stateTopValueList.sort((a, b) => b.value - a.value);

      // Get the top 10 states
      const top10States = sortedStates.slice(0, 10);

      return top10States;
    };

    const colorRangeAbs = isPT ? ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(155, 196, 253, 0.5)', '#9BC4FD'] 
                               : ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(255, 165, 0, 0.5)', '#FFA500'];      
    const colorRange = isPT ? ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(155, 196, 253, 0.5)', '#9BC4FD']
                            : ['#DD0606','rgba(221, 6, 6, 0.5)', '#FFFFFF','rgba(255, 165, 0, 0.5)', '#FFA500'];

                            
    const colorScaleAbs = d3.scaleLinear<string>()
      .domain(isPC ? [-3000, 500, 5000, 7500, 10000] : (isPT ? [-40, -20, 0, 20, 40] : [-200, -100, 0, 100, 200]))
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
            tooltipContent = isPC ? `${calculateCarAbsBil(d.properties.id, selectedMetricCar).toFixed(0)} km pc.` : `${calculateCarAbsBil(d.properties.id, selectedMetricCar).toFixed(1)} bil. passenger km`;
            break;
          case FilterOptions.Comparison:
            tooltipContent = isPT ? `${calculatePTAbsBil(d.properties.id, selectedMetricPT).toFixed(1)} bil. passenger km` : `${calculateCarAbsBil(d.properties.id, selectedMetricCar).toFixed(1)} bil. passenger km`;
            break;  
          case FilterOptions.CarsDev:
            tooltipContent = `${calculatePercentageChange(d.properties.id, selectedMetricCar, carData).toFixed(2)} % change\nin pass. km`;
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
        onStateHover(null);
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
          if (selectedState === d.properties.id) { return 'url(#stripes-pattern)' }
          
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

    }, [startYear, endYear, selectedMetricPT, selectedMetricCar, isPT, isPC, currentFilter, selectedState, rankingVisible]);

    const top3StatesCarPerc = getTop3States(selectedMetricCar, carData);
    const top10StatesCarAbs = getTop10CarAbs(selectedMetricCar, carData);
    const top10StatesPTAbs = getTop10PTAbs(selectedMetricPT, transportData);
    const rankingEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    return (
        <>
        <div style={{ width: '430px' }}>
            <CardOverflow>
                {(currentFilter === FilterOptions.Comparison) ? (
                  <>
                    <SegmentedControlsFilter items={["Show Public Transport", "Show Cars"]} onChange={(index, item) => setPT(index === 0)} />
                    <Divider inset="context" />
                  </>
                ) : (
                  (currentFilter === FilterOptions.CarsAbs) ? (
                    <>
                    <SegmentedControlsFilter items={["In Total", "Per Capita"]} onChange={(index, item) => setPC(index === 1)} />
                    <Divider inset="context" />
                  </>
                  ) : (
                    <div style={{ height: '60px', marginBottom: '20px'}}>
                        <Stack direction={'column'} divider={<Divider orientation='horizontal' />} gap={0.2}>
                            {top3StatesCarPerc.map((stateData, index) => (
                              <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                  <Typography>
                                      {rankingEmojis[index]} {stateData.stateName} &#x2022; {stateData.value.toFixed(2)} % change in pass. km
                                  </Typography>
                              </motion.div>
                            ))}
                        </Stack>
                    </div>
                  )
                )}
            </CardOverflow>

          {currentFilter != FilterOptions.CarsDev && rankingVisible ?
            <>
            <Typography sx={{ marginTop: '20px', marginBottom: '15px' }}>{`Top 10 ${isPT ? 'Public Transport' : 'Car'} States:`}</Typography>
            <Stack direction={'column'} divider={<Divider orientation='horizontal' />} gap={0.6}>
            {isPT
              ? top10StatesPTAbs.map((stateData, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Typography>
                      {rankingEmojis[index]} {stateData.stateName} &#x2022; {isPC ? stateData.value.toFixed(0) : stateData.value.toFixed(1)} {isPC ? "km pc." : "bil. pass. km"}
                    </Typography>
                  </motion.div>
                ))
              : top10StatesCarAbs.map((stateData, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Typography>
                      {rankingEmojis[index]} {stateData.stateName} &#x2022; {isPC ? stateData.value.toFixed(0) : stateData.value.toFixed(1)} {isPC ? "km pc." : "bil. pass. km"}
                    </Typography>
                  </motion.div>
                ))}
            </Stack>
            </>
          :
            <Stack direction="row" marginTop="20px" alignItems={"flex-start"} justifyContent={"center"}>

              <Stack direction="column">
                  <svg ref={svgRef} width={width} height={height}></svg>
                  {selectedState && (
                      <div style={{ position: 'absolute', pointerEvents: 'none' }}>
                          {selectedState}
                      </div>
                  )}
              </Stack>

              <Stack direction="column" width={"100px"} paddingLeft={"25px"}>
                {(currentFilter === FilterOptions.CarsAbs && !rankingVisible) ? (
                    <MapLegend 
                      paddingEnd={40} 
                      tooltip={`Color Scale for ${isPC ? 'Car Usage per Capita' : 'Total Car Usage' }`} 
                      headline={isPC ? "🚗 Passenger km in thsd." : "🚗 Passenger km in billion"}
                      scale={isPC
                        ? [{text: "10", color: "#FFA500"}, {text: "7.5", color: "rgba(255, 165, 0, 0.5)"}, {text: "5", color: "#FFFFFF"}] 
                        : [{text: "200", color: "#FFA500"}, {text: "100", color: "rgba(255, 165, 0, 0.5)"}, {text: "0", color: "#FFFFFF"}]}
                    ></MapLegend>
                ) : ((currentFilter === FilterOptions.Comparison) ? (
                  <MapLegend 
                    paddingEnd={40} 
                    tooltip={`Color Scale for ${isPT ? 'Public Transport' : 'Cars'}`} 
                    headline={isPT ? "🚊 Passenger km in billion" : "🚗 Passenger km in billion"}
                    scale={isPT 
                      ? [{text: "40", color: "#9BC4FD"}, {text: "20", color: "rgba(155, 196, 253, 0.5)"}, {text: "0", color: "#FFFFFF"}] 
                      : [{text: "200", color: "#FFA500"}, {text: "100", color: "rgba(255, 165, 0, 0.5)"}, {text: "0", color: "#FFFFFF"}]}
                  ></MapLegend>
                ) : ((currentFilter === FilterOptions.CarsDev) ? (
                  <MapLegend 
                    paddingEnd={40} 
                    tooltip="Color Scale for Cars" 
                    headline="🚗 Change of usage in %"
                    scale={[{text: "10", color: "#FFA500"}, {text: "5", color: "rgba(255, 165, 0, 0.5)"}, {text: "0", color: "#FFFFFF"}, {text: "-5", color: "rgba(221, 6, 6, 0.5)"}, {text: "-10", color: "#DD0606"}]}
                  ></MapLegend>
                ) : <></>))}
              </Stack>

            </Stack>
            }

            {currentFilter != FilterOptions.CarsDev ? 
            <Stack style={{ position: 'absolute', bottom: 0, right: 0, width: '100%'}}>
              <Divider/>
              <CardContent orientation="horizontal" sx={{ marginLeft: 'auto' }}>
                <Button variant="outlined" sx={{margin: '7.25px'}} onClick={() => handleRankingVisibility()} startDecorator={rankingVisible? <Map/> : <Sort/>}>{rankingVisible ? 'Switch to Map' : 'Switch to Ranking'}</Button>
              </CardContent>
            </Stack> : null
            }

            {tooltipVisible && (
                <ChartTooltip tooltipPosition={tooltipPosition} tooltipState={tooltipState} tooltipContent={tooltipContent}></ChartTooltip>
            )}
        </div>
        </>
    );
};

export default MapChart;
