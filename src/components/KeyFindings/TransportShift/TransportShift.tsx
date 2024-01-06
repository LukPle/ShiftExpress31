import React, { useState, useEffect } from 'react';
import CombinedDevTS from './CombinedDevTS';
import MapTS from './MapTS';
import LineChartTS from './LineChartTS';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import {
  Card,
  Stack,
  IconButton,
  Typography,
  Button,
} from "@mui/joy";
import {
  PlayArrow,
  Pause,
  FastRewind,
} from "@mui/icons-material";

export enum FilterOptions {
  Comparison, FocusPublicTransport, FocusCars
}

const TransportShift: React.FC = () => {
  const [endYear, setEndYear] = useState<number>(2013);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
      }, 1500);
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
      <Card>
          <Stack direction={"row"} spacing={2}>
            <Button variant={currentFilter === FilterOptions.Comparison ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.Comparison)}>Comparison</Button>
            <Button variant={currentFilter === FilterOptions.FocusPublicTransport ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusPublicTransport)}>Focus Public Transport</Button>
            <Button variant={currentFilter === FilterOptions.FocusCars ? "solid" : "outlined"} onClick={() => setCurrentFilter(FilterOptions.FocusCars)}>Focus Cars</Button>
          </Stack>
        </Card>
      <Stack direction={"row"} gap={2} sx={{}} >
        <Stack direction={"column"} gap={2} sx={{ flex: 2 }}>
          <Card>
            <CombinedDevTS carData={carData} transportData={pTData} endYear={endYear.toString()} currentFilter={currentFilter} />
          </Card>
          <Card>
            <LineChartTS carData={carData} transportData={pTData} startYear='2013' endYear='2019' currentYear={endYear.toString()} setCurrentYear={setCurrentYear} currentFilter={currentFilter}/>
            <Stack direction={"row"} gap={1} sx={{}} pt={2} alignItems={"center"} justifyContent={"flex-start"} minWidth={"100%"}>
              <IconButton variant="solid" onClick={handlePlayPause} size="lg" sx={{ backgroundColor: (endYear === 2019) ? 'grey' : "#03045A" }}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton variant="solid" onClick={() => setEndYear(2013)} size="lg" sx={{ backgroundColor: "#03045A" }}>
                <FastRewind />
              </IconButton>
              <Typography pt={2} marginLeft={'15px'}><i>Current Year: {endYear}</i></Typography>
          </Stack>
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
