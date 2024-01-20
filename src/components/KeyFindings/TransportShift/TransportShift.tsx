import React, { useState, useEffect } from 'react';
import CombinedDevTS from './CombinedDevTS';
import MapTS from './MapTS';
import LineChartTS from './LineChartTS';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import MiniLegend from './MiniLegend';
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
                    <Button variant={currentFilter === FilterOptions.Comparison ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.Comparison)} sx={{ maxHeight: "30px" }}>🚈 vs 🚗 Comparison</Button>
                    <Button variant={currentFilter === FilterOptions.FocusPublicTransport ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusPublicTransport)} sx={{ maxHeight: "30px" }}>🚈 Focus Public Transport</Button>
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
                  <Typography startDecorator={<InteractionTooltip tooltipText={`Overview of the cumulated percental change across Germany from 2013 to ${endYear} measured at each year`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Cumulative change of usage in Germany from 2013 to {endYear.toString()}</Typography>
                </Stack>
                <Divider orientation="vertical" />
                <MiniLegend currentOption={currentFilter} />
              </CardContent>
            </CardOverflow>
          </Card>
          <Card>
            <Stack alignItems={"center"}>
              <CombinedDevTS carData={carData} transportData={pTData} endYear={endYear.toString()} currentFilter={currentFilter} />
            </Stack>
            <CardOverflow>
              <Divider inset="context" />
              <CardContent orientation="horizontal">
                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography startDecorator={<InteractionTooltip tooltipText={`The percental change is calculated from the usage measured in ${endYear} in relation to the usage in 2013`} delay={0} position={'bottom-end'}><InfoOutlined /></InteractionTooltip>}>Change of usage from 2013 to {endYear} across all federal states</Typography>
                </Stack>
                <Divider orientation="vertical" />
                <MiniLegend currentOption={currentFilter} />
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
            <MapTS transportData={pTData} carData={carData} endYear={endYear.toString()} currentFilter={currentFilter} />
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TransportShift;
