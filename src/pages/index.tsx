import React, { useEffect, useRef } from 'react';
import { Card, Typography, Stack, Divider } from "@mui/joy";
import ChapterArea from '@/components/ChapterArea';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import indexStyles from '../styles/index.module.css';
import Keyfact from "@/components/Keyfact";
import Map from "@/components/Map";
import Comparison from "@/components/Comparison";
import FilterBox from "@/components/FilterBox";
import FederalStateBox from "@/components/FederalStateBox";
import TeamTile from "@/components/TeamTile";
import Image from 'next/image';
import BarChartPT from "@/components/BarChartPT";
import BarChartCar from "@/components/BarChartCar";
import LineChartPT from "@/components/LineChartPT";
import LineChartCar from "@/components/LineChartCar";
import pTData from "../data/pT.json";
import carData from "../data/car.json";

type HomeProps = {
  currentSection: number;
  setSection: (section: number) => void;
};

const Home: React.FC<HomeProps> = ({ currentSection, setSection }) => {
  const sectionOffsets: number[] = [];
  const introSectionRef = useRef<HTMLDivElement>(null);
  const projectSectionRef = useRef<HTMLDivElement>(null);
  const insightsSectionRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const scrollShiftFactor = 100;

  useEffect(() => {
    sectionOffsets.push(introSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(projectSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(insightsSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(teamSectionRef.current?.offsetTop || 0);

    const scrollHandleSection = () => {
      const position = window.scrollY;
      const currentSecOffset = sectionOffsets.find(el => el + scrollShiftFactor >= position);
      const currentSec = sectionOffsets.indexOf(currentSecOffset || 0);

      setSection(currentSec);
    };

    window.addEventListener('scroll', scrollHandleSection);

    return () => {
      window.removeEventListener('scroll', scrollHandleSection);
    };
  }, []);
  

  return (
    <>
      <Stack direction={"column"} mx={17} my={7}>
          <ChapterArea>
            <Stack direction="column" className={indexStyles.headingStack} ref={introSectionRef}>
              {/* SVG with line background */}
              <svg className={indexStyles.headingSvg} viewBox="0 0 1000 200" version='1.1' xmlns='http://www.w3.org/2000/svg'>
                <rect x="410" y="65" width="80" height="30" rx="15" className={indexStyles.stationCircleHeadingSvg} />
                <text x="427" y="85" className={indexStyles.stationTextHeadingSvg}>InfoViz</text>
                <polyline points="490,80 980,80 995,95 995,180 980,195 18,195 3,210 3,230" className={indexStyles.lineHeadingSvg} />
              </svg>
              <Image src={require('@/assets/train.svg')} alt="train" className={indexStyles.trainSvg} />
              
              <div className="column">
                <Typography level="h1" className={indexStyles.titleHeading}>Visualizing the transportation <br /> shift in Germany</Typography>
                <br />
                <Typography level="h2" mt={2}>Comparing the usage of public transport and cars <br /> for the years from 2013 to 2022 across all federal states.</Typography>
              </div>
            </Stack>
          </ChapterArea>
        

        <ChapterArea>
          <Stack direction={"column"} id="project" mt={7} className={indexStyles.lineLeftStack} ref={projectSectionRef}>
            <Typography level="h2" className={currentSection == 1 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Project</Typography>
            <Typography mt={2}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo do</Typography>
          </Stack>
        </ChapterArea>

        <ChapterArea>
          <Stack direction={"column"} id="insights" mt={7} className={indexStyles.lineLeftStack} ref={insightsSectionRef}>
            <Typography level="h2" className={currentSection == 2 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Insights and Map</Typography>
            <Stack direction={"column"}>
              <Typography level="h3" mt={4}>Our Key Findings</Typography>
              <Stack
                direction={"row"}
                justifyContent="space-evenly"
                alignItems="center"
                spacing={4}
                mt={2}
              >
                <Keyfact />
                <Keyfact />
                <Keyfact />
              </Stack>
            </Stack>

            <Stack direction={"column"}>
              <Typography level="h3" mt={4}>Explore Yourself</Typography>
              <Stack direction={"row"} mt={2}>
                <Stack direction={"column"}>
                  <FilterBox />
                  <FederalStateBox />
                </Stack>
                <Map />
              </Stack>
              <Comparison />
            </Stack>
            <Typography level="h3" mt={4} startDecorator={<TrainIcon />}>Insights: <i>Public Transportation</i></Typography>
            <Typography level="h4" mt={4}>Passengers in one Year</Typography>
            <Card sx={{ my: 3 }}><BarChartPT data={pTData} /></Card>
            <Typography level="h4" mt={4}>Passenger development over Time</Typography>
            <Card sx={{ my: 3 }}><LineChartPT data={pTData} /></Card>

            <Divider sx={{ my: 3 }} />

            <Typography level="h3" mt={4} startDecorator={<DirectionsCarIcon />}>Insights: <i>Cars</i></Typography>
            <Typography level="h4" mt={4}>Passenger KMs in one Year</Typography>
            <Card sx={{ my: 3 }}><BarChartCar data={carData} /></Card>
            <Typography level="h4" mt={4}>Passenger KMs development over Time</Typography>
            <Card sx={{ my: 3 }}><LineChartCar data={carData} /></Card>
          </Stack>
        </ChapterArea>
        
        <ChapterArea>
          <Stack direction={"column"} mt={7} className={indexStyles.lineLeftHalfAcrossStack} ref={teamSectionRef}>
            <Typography level="h2" id="team" className={currentSection == 3 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Team</Typography>
            <Stack mt={3} direction={"row"} alignItems={"center"} justifyContent={"center"} flexWrap="wrap" gap={15}>
              <TeamTile className={indexStyles.teamTileTop} imageSrc={require('@/assets/amiin.png')} name="Amiin Najjar" desc="HCI student with a passion for sport and cooking, I've swapped public transportation for pedaling my bike, blending tech insights with a dash of culinary creativity and a healthy dose of physical activity." />
              <TeamTile className={indexStyles.teamTileTop} imageSrc={require('@/assets/lukas.png')} name="Lukas Plenk" desc="I’m a Human-Computer-Interaction student at LMU Munich interested in digital media, culture, and traveling. Just like public transport, I’m always out for the next destination ahead." />
              <TeamTile className={indexStyles.teamTileTop} imageSrc={require('@/assets/tim.png')} name="Timothy Summers" desc="I love collaborating in a team and solving creative challenges! Always ready for adventure - I can even handle Munich public transportation during rush hour!" />
              <TeamTile className={indexStyles.teamTileBottom} imageSrc={require('@/assets/malek.png')} name="Malek Jarraya" desc="I’m a Media Informatics student at LMU Munich. I love colors, the sun, and the sea. I didn't know much about public transportation in the past, but our project definitely changed that." />
              <TeamTile className={indexStyles.teamTileBottom} imageSrc={require('@/assets/maxi.png')} name="Maximilian Wiegand" desc="Hey, I'm a media computer science student at LMU Munich. I love to design, develop and explore - not only for computers. Some ideas even came up in delayed and overcrowded public transport…" />
            </Stack>
          </Stack>
        </ChapterArea>

      </Stack>

    </>
  );
};

export default Home;
