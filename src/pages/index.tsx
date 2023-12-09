import React, { useEffect, useRef } from 'react';
import ChapterArea from '@/components/ChapterArea';
import { Card, Typography, Stack, AccordionGroup, Accordion, AccordionDetails, AccordionSummary } from "@mui/joy";
import {Train, DirectionsCar, MergeType } from '@mui/icons-material';
import indexStyles from '../styles/index.module.css';
import Keyfact from "@/components/Keyfact";
import Map from "@/components/Map";
import Comparison from "@/components/Comparison";
import FilterBox from "@/components/FilterBox";
import FederalStateBox from "@/components/FederalStateBox";
import TeamTile from "@/components/TeamTile";
import BarChartPT from "@/components/ChartsPT/BarChartPT";
import BarChartPTDev from "@/components/ChartsPT/BarChartPTDevelopment";
import BarChartCar from "@/components/ChartsCars/BarChartCar";
import BarChartCarDev from "@/components/ChartsCars/BarChartCarDevelopment";
import LineChartPT from "@/components/ChartsPT/LineChartPT";
import LineChartCar from "@/components/ChartsCars/LineChartCar";
import BarChartDevelopmentCombined from "@/components/ChartsCombined/BarChartDevelopmentCombined";
import BarChartCombined from "@/components/ChartsCombined/BarChartCombined";
import pTData from "../data/pT.json";
import carData from "../data/car.json";
import popData from "../data/population.json";
import ProjectArea from '@/components/ProjectSection/ProjectArea';

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
      <Stack direction={"column"} mx={13} my={7}>
          <ChapterArea>
            <Stack direction="column" className={indexStyles.headingStack} ref={introSectionRef}>
              {/* SVG with line background */}
              <svg className={indexStyles.headingSvg} viewBox="0 0 1000 200" version='1.1' xmlns='http://www.w3.org/2000/svg'>
                <rect x="580" y="50" width="80" height="30" rx="15" className={indexStyles.stationCircleHeadingSvg} />
                <text x="598" y="70.5" className={indexStyles.stationTextHeadingSvg}>InfoVis</text>
                <polyline points="660,65 960,65 995,105 995,200 960,240 25,240 3,270 5,590" className={indexStyles.lineHeadingSvg} />
              </svg>
              <img src={'/train.svg'} alt="train" className={indexStyles.trainSvg} />
              
              <div className="column">
                <Typography level="h1" className={indexStyles.titleHeading}>Visualizing the transportation <br /> shift in Germany</Typography>
                <br />
                <Typography level="h2" mt={2}>Comparing the usage of public transport and cars for <br /> the years from 2013 to 2022 across all federal states.</Typography>
              </div>
            </Stack>
          </ChapterArea>
        

        <ChapterArea>
          <Stack direction={"column"} id="project" mt={7} className={indexStyles.lineLeftStack} ref={projectSectionRef}>
            <Typography level="h2" className={currentSection == 1 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Project</Typography>
            <ProjectArea></ProjectArea>
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
            <Typography level="h3" mt={4} startDecorator={<Train />}>Insights: <i>&nbsp;Public Transportation</i></Typography>
          <AccordionGroup size='lg' sx={{ my: 3, minWidth: "100%" }}>
            <Accordion>
              <AccordionSummary>Total PT Data in specific Year</AccordionSummary>
              <AccordionDetails>
                <Card sx={{ my: 3 }}><BarChartPT data={pTData} populationData={popData} /></Card>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>Total PT Data development over Time</AccordionSummary>
              <AccordionDetails>
                <Card sx={{ my: 3 }}><LineChartPT data={pTData} /></Card>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>Total PT Data change over Interval</AccordionSummary>
              <AccordionDetails>
                <Card sx={{ my: 3, minWidth: "100%" }}><BarChartPTDev data={pTData} /></Card>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>


          <Typography level="h3" mt={4} startDecorator={<DirectionsCar />}>Insights: <i>&nbsp;Cars</i></Typography>
          <AccordionGroup size='lg' sx={{ my: 3, minWidth: "100%" }}>
            <Accordion>
              <AccordionSummary>Car Data in specific Year</AccordionSummary>
              <AccordionDetails>
                <Card sx={{ my: 3 }}><BarChartCar data={carData} populationData={popData} /></Card>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>Car Data development over Time</AccordionSummary>
              <AccordionDetails>
              <Card sx={{ my: 3 }}><LineChartCar data={carData} /></Card>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>Car Data change over Interval</AccordionSummary>
              <AccordionDetails>
              <Card sx={{ my: 3 }}><BarChartCarDev data={carData} /></Card>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>

          <Typography level="h3" mt={4} startDecorator={<MergeType />}>Insights: <i>&nbsp;Combining Data Sets</i></Typography>
          <AccordionGroup size='lg' sx={{ my: 3, minWidth: "100%" }}>
            <Accordion>
              <AccordionSummary>Combined Data development over Time</AccordionSummary>
              <AccordionDetails>
                <Card sx={{ my: 3 }}><BarChartDevelopmentCombined carData={carData} transportData={pTData}/></Card>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>Combined Data in specific Year</AccordionSummary>
              <AccordionDetails>
                <Card sx={{ my: 3 }}><BarChartCombined carData={carData} transportData={pTData} populationData={popData} /></Card>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>
          </Stack>
        </ChapterArea>
        
        <ChapterArea>
          <Stack direction={"column"} mt={7} className={indexStyles.lineLeftHalfAcrossStack} ref={teamSectionRef}>
            <Typography level="h2" id="team" className={currentSection == 3 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Team</Typography>
            <Stack mt={3} direction={"row"} alignItems={"center"} justifyContent={"center"} flexWrap="wrap" gap={15}>
              <TeamTile className={indexStyles.teamTileTop} imageSrc={'/amiin.png'} name="Amiin Najjar" desc="HCI student with a passion for sport and cooking, I've swapped public transportation for pedaling my bike, blending tech insights with a dash of culinary creativity and a healthy dose of physical activity." />
              <TeamTile className={indexStyles.teamTileTop} imageSrc={'/lukas.png'} name="Lukas Plenk" desc="I’m a Human-Computer-Interaction student at LMU Munich interested in digital media, culture, and traveling. Just like public transport, I’m always out for the next destination ahead." />
              <TeamTile className={indexStyles.teamTileTop} imageSrc={'/tim.png'} name="Timothy Summers" desc="I love collaborating in a team and solving creative challenges! Always ready for adventure - I can even handle Munich public transportation during rush hour!" />
              <TeamTile className={indexStyles.teamTileBottom} imageSrc={'/malek.png'} name="Malek Jarraya" desc="I’m a Media Informatics student at LMU Munich. I love colors, the sun, and the sea. I didn't know much about public transportation in the past, but our project definitely changed that." />
              <TeamTile className={indexStyles.teamTileBottom} imageSrc={'/maxi.png'} name="Maximilian Wiegand" desc="Hey, I'm a media computer science student at LMU Munich. I love to design, develop and explore - not only for computers. Some ideas even came up in delayed and overcrowded public transport…" />
            </Stack>
          </Stack>
        </ChapterArea>

      </Stack>

    </>
  );
};

export default Home;
