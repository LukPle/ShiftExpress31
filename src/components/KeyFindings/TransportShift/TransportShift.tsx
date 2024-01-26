import React, { useState, useEffect } from 'react';
import CombinedDevTS from './CombinedDevTS';
import MapTS from './MapTS';
import LineChartTS from './LineChartTS';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import MiniLegend from '../ChartLegendsAndTooltip/MiniLegend';
import KeyMetricsTS from './KeyMetricsTS';
import {
  Card,
  Stack,
  IconButton,
  Typography,
  Button,
  CardOverflow,
  CardContent,
  Divider,
} from "@mui/joy";
import {
  PlayArrow,
  Pause,
  FastRewind,
  InfoOutlined
} from "@mui/icons-material";
import InteractionTooltip from '@/components/InteractionTooltip';

export enum FilterOptions {
  Comparison, FocusPublicTransport, FocusCars
}

const TransportShift: React.FC = () => {
  const [endYear, setEndYear] = useState<number>(2013);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>(FilterOptions.Comparison);

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const handleStateHover = (stateId: string | null) => {
    setSelectedState(stateId);
  };



  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        if (endYear < 2019) {
          setEndYear((prevYear) => prevYear + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, endYear]);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const setCurrentYear = (year: string) => {
    setEndYear(parseInt(year));
  };

  return (
    <Stack direction={"column"} minWidth={"100%"} gap={2} pt={2}>
      <Stack direction={"row"} gap={2} sx={{}} >
        <Stack direction={"column"} gap={2} sx={{ flex: 2 }}>
          <Card>
            <CardOverflow>
              <CardContent orientation="horizontal">
                <Stack direction={"row"} gap={2} alignItems={"center"} justifyContent={"flex-start"}>
                  <Stack direction={"row"} gap={1} sx={{}} alignItems={"center"} justifyContent={"flex-start"}>
                    <IconButton variant="solid" onClick={(endYear === 2019) ? () => { } : handlePlayPause} size="lg" sx={{ backgroundColor: (endYear === 2019) ? 'grey' : "#03045A" }}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton variant="solid" onClick={() => setEndYear(2013)} size="lg" sx={{ backgroundColor: "#03045A" }}>
                      <FastRewind />
                    </IconButton>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack direction={"row"} spacing={2}>
                    <Button variant={currentFilter === FilterOptions.Comparison ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.Comparison)} sx={{ maxHeight: "30px" }}>🚊 vs 🚗 Comparison</Button>
                    <Button variant={currentFilter === FilterOptions.FocusPublicTransport ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusPublicTransport)} sx={{ maxHeight: "30px" }}>🚊 Focus Public Transport</Button>
                    <Button variant={currentFilter === FilterOptions.FocusCars ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusCars)} sx={{ maxHeight: "30px" }}>🚗 Focus Cars</Button>
                  </Stack>
                </Stack>
              </CardContent>
              <Divider inset="context" />
            </CardOverflow>
            <Stack alignItems={"center"}>
              <LineChartTS carData={carData} transportData={pTData} startYear='2013' endYear='2019' currentYear={endYear.toString()} setCurrentYear={setCurrentYear} currentFilter={currentFilter} />
            </Stack>
            <CardOverflow>
              <Divider inset="context" />
              <CardContent orientation="horizontal">
                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography startDecorator={<InteractionTooltip tooltipText={`Explore detailed changes of usage by hovering over specific data points on the chart`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Change from 2013 to {endYear.toString()} in %</Typography>
                </Stack>
                <Divider orientation="vertical" />
                <MiniLegend currentOption={currentFilter} carText='🚗 total passenger kms' ptText='🚊 total passenger kms'/>
              </CardContent>
            </CardOverflow>
          </Card>
          <Card>
            <Stack alignItems={"center"}>
                        <CombinedDevTS carData={carData} transportData={pTData} endYear={endYear.toString()} currentFilter={currentFilter} onStateHover={handleStateHover} selectedState={selectedState}/>
            </Stack>
            <CardOverflow>
              <Divider inset="context" />
              <CardContent orientation="horizontal">
                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography startDecorator={<InteractionTooltip tooltipText={`Explore detailed usage changes by hovering over a state`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Change from 2013 to {endYear.toString()} in %</Typography>
                </Stack>
                <Divider orientation="vertical" />
                <MiniLegend currentOption={currentFilter} carText='🚗 passenger kms per state' ptText='🚊 passenger kms per state'/>
              </CardContent>
            </CardOverflow>
          </Card>
        </Stack>
        <Stack direction={"column"} gap={2} >
          <Card>
            <CardContent orientation="horizontal">
              <KeyMetricsTS carData={carData} transportData={pTData} startYear='2013' endYear={endYear.toString()} currentFilter={currentFilter} />
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <MapTS transportData={pTData} carData={carData} endYear={endYear.toString()} currentFilter={currentFilter} onStateHover={handleStateHover} selectedState={selectedState}/>
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TransportShift;
