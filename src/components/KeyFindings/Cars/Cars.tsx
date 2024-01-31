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
import MapCar from '../Cars/MapCar';
import LineChartTS from '../TransportShift/LineChartTS';
import AbsoluteDataBarChart from './AbsoluteDataBarChart';
import MapTS from '../TransportShift/MapTS';
import LineChartCars from './LineChartCars';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import popData from "../../../data/population.json";
import MiniLegend from '../ChartLegendsAndTooltip/MiniLegend';
import InteractionTooltip from '@/components/InteractionTooltip';
import KeyMetricsCars from "@/components/KeyFindings/Cars/KeyMetricsCars";

export enum FilterOptions {
  CarsAbs, Comparison, CarsDev
}

const Cars: React.FC = () => {
  const [endYear, setEndYear] = useState<number>(2013);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
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
                    <IconButton variant="solid" onClick={(endYear === 2022) ? () => { } : handlePlayPause} size="lg" sx={{ backgroundColor: (endYear === 2022) ? 'grey' : "#03045A" }}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton variant="solid" onClick={() => setEndYear(2013)} size="lg" sx={{ backgroundColor: "#03045A" }}>
                      <FastRewind />
                    </IconButton>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack direction={"row"} spacing={2}>
                    <Button variant={currentFilter === FilterOptions.CarsAbs ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.CarsAbs)} sx={{ maxHeight: "30px" }}>🚗 Absolute Car Data</Button>
                    <Button variant={currentFilter === FilterOptions.Comparison ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.Comparison)} sx={{ maxHeight: "30px" }}>🚗 vs 🚊 Comparison</Button>
                    <Button variant={currentFilter === FilterOptions.CarsDev ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.CarsDev)} sx={{ maxHeight: "30px" }}>🚗 Development of Car Usage</Button>
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
                  <Typography startDecorator={<InteractionTooltip tooltipText='Explore detailed changes of usage by hovering over specific data points on the chart' delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Change from 2013 to {endYear.toString()} in %</Typography>
                </Stack>
                <Divider orientation="vertical" />
                <MiniLegend currentOption={currentFilter} isCarKeyFinding={true} carText='🚗 total passenger kms' ptText='🚊 total passenger kms'/>
              </CardContent>
            </CardOverflow>
          </Card>
              <AbsoluteDataBarChart carData={carData} transportData={pTData} populationData={popData} currentFilter={currentFilter} selectedYear={endYear.toString()} onStateHover={handleStateHover} selectedState={selectedState} />
        </Stack>
        <Stack direction={"column"} gap={2} >
          <Card>
            <CardContent orientation="horizontal">
              <KeyMetricsCars carData={carData} transportData={pTData} startYear='2013' endYear={endYear.toString()} currentFilter={currentFilter} />
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <MapCar transportData={pTData} carData={carData} endYear={endYear.toString()} currentFilter={currentFilter} populationData={popData} onStateHover={handleStateHover} selectedState={selectedState}/>
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Cars;
