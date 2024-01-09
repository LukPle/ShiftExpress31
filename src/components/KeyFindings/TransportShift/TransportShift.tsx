import React, { useState, useEffect } from 'react';
import CombinedDevTS from './CombinedDevTS';
import MapTS from './MapTS';
import LineChartTS from './LineChartTS';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import MiniLegend from './MiniLegend';
import {
  Card,
  Stack,
  IconButton,
  Typography,
  Button,
  CardOverflow,
  CardContent,
  Divider
} from "@mui/joy";
import {
  PlayArrow,
  Pause,
  FastRewind,
  InfoOutlined
} from "@mui/icons-material";

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
            <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
              <CardContent orientation="horizontal">
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
                  <Button variant={currentFilter === FilterOptions.Comparison ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.Comparison)} sx={{maxHeight: "30px"}}>Comparison</Button>
                  <Button variant={currentFilter === FilterOptions.FocusPublicTransport ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusPublicTransport)} sx={{maxHeight: "30px"}}>Focus Public Transport</Button>
                  <Button variant={currentFilter === FilterOptions.FocusCars ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusCars)} sx={{maxHeight: "30px"}}>Focus Cars</Button>
                </Stack>
              </CardContent>
              <Divider inset="context" />
            </CardOverflow>
            <LineChartTS carData={carData} transportData={pTData} startYear='2013' endYear='2019' currentYear={endYear.toString()} setCurrentYear={setCurrentYear} currentFilter={currentFilter} />
            <CardOverflow>
            <Divider inset="context" />
              <CardContent orientation="horizontal">
                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography startDecorator={<InfoOutlined />}>Cumulative change of usage in Germany from 2013 to {endYear.toString()}</Typography>
                </Stack>
                <Divider orientation="vertical" />
                  <MiniLegend currentOption={currentFilter} />
              </CardContent>
            </CardOverflow>
          </Card>
          <Card>
          <CombinedDevTS carData={carData} transportData={pTData} endYear={endYear.toString()} currentFilter={currentFilter} />
          <CardOverflow>
            <Divider inset="context" />
              <CardContent orientation="horizontal">
                <Stack direction={"row"} sx={{ flex: 1 }} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography startDecorator={<InfoOutlined />}>Change of usage from 2013 to {endYear} across all federal states</Typography>
                </Stack>
                <Divider orientation="vertical" />
                  <MiniLegend currentOption={currentFilter}/>
              </CardContent>
            </CardOverflow>
          </Card>
        </Stack>
        <Card sx={{ flex: 1 }}>
          <MapTS transportData={pTData} carData={carData} endYear={endYear.toString()} currentFilter={currentFilter} />
        </Card>
      </Stack>
    </Stack>
  );
};

export default TransportShift;
