import React, { useState, useEffect } from 'react';
import CombinedDevTS from './CombinedDevTS';
import MapTS from './MapTS';
import pTData from "../../../data/pT.json";
import carData from "../../../data/car.json";
import {
  Card,
  Stack,
  IconButton,
  Typography,
} from "@mui/joy";
import {
  PlayArrow,
  Pause,
  FastRewind,
} from "@mui/icons-material";

const TransportShift: React.FC = () => {
  const [endYear, setEndYear] = useState<number>(2013);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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

  return (
    <Stack direction={"column"} minWidth={"100%"}>
      <Stack direction={"row"} gap={2} sx={{}} pt={3}>
        <Card sx={{ flex: 1.5 }}>
          <CombinedDevTS carData={carData} transportData={pTData} endYear={endYear.toString()} />
        </Card>
        <Card sx={{ flex: 1 }}>
          <MapTS transportData={pTData} endYear={endYear.toString()} />
        </Card>
      </Stack>
      <Stack direction={"row"} gap={1} sx={{}} pt={2} alignItems={"center"} justifyContent={"flex-start"} minWidth={"100%"}>
        <IconButton variant="solid" onClick={handlePlayPause} size="lg" sx={{ backgroundColor: "#03045A" }}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton variant="solid" onClick={() => setEndYear(2013)} size="lg" sx={{ backgroundColor: "#03045A" }}>
          <FastRewind />
        </IconButton>
      </Stack>
      <Typography pt={2}><i>End Year: {endYear}</i></Typography>
    </Stack>
  );
};

export default TransportShift;
