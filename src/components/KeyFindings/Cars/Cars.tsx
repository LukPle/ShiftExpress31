import React, { useState, useEffect } from 'react';
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
import CombinedDevTS from '../TransportShift/CombinedDevTS';
import MapTS from '../TransportShift/MapTS';
import LineChartCars from './LineChartCars';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import MiniLegend from '../ChartLegendsAndTooltip/MiniLegend';
import KeyMetricsTS from '../TransportShift/KeyMetricsTS';
import InteractionTooltip from '@/components/InteractionTooltip';


export enum FilterOptions {
  CarsAbs, Comparison, CarsDev
}

const Cars: React.FC = () => {
  const [endYear, setEndYear] = useState<number>(2013);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>(FilterOptions.CarsAbs);

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const handleStateHover = (stateId: string | null) => {
    setSelectedState(stateId);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        if (endYear < 2022) {
          setEndYear((prevYear) => prevYear + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000);
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
                    <Button variant={currentFilter === FilterOptions.CarsAbs ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.CarsAbs)} sx={{ maxHeight: "30px" }}>🚗 Cars in Germany</Button>
                    <Button variant={currentFilter === FilterOptions.Comparison ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.Comparison)} sx={{ maxHeight: "30px" }}>🚗 vs 🚊 in Germany</Button>
                    <Button variant={currentFilter === FilterOptions.CarsDev ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.CarsDev)} sx={{ maxHeight: "30px" }}>🚗 Development of Cars in Germany</Button>
                  </Stack>
                </Stack>
              </CardContent>
              <Divider inset="context" />
            </CardOverflow>
            <Stack alignItems={"center"}>
              <LineChartCars carData={carData} transportData={pTData} startYear='2013' endYear='2022' currentYear={endYear.toString()} setCurrentYear={setCurrentYear} currentFilter={currentFilter} />
            </Stack>
            <CardOverflow>
              <Divider inset="context" />
              <CardContent orientation="horizontal">
                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography startDecorator={<InteractionTooltip tooltipText={`Adjust the charts by selecting a year in the timeline - you can also play and rewind`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Cumulative change of usage in Germany from 2013 to {endYear.toString()}</Typography>
                </Stack>
                <Divider orientation="vertical" />
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
                  <Typography startDecorator={<InteractionTooltip tooltipText={`Hover over the states to get more details about the change of usage`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Change of usage from 2013 to {endYear} across all federal states</Typography>
                </Stack>
                <Divider orientation="vertical" />
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

export default Cars;
