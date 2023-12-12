import React, { useEffect, useRef, useState } from "react";
import ChapterArea from "@/components/Layout/ChapterArea";
import {
  Card,
  CardContent,
  CardCover,
  Typography,
  Stack,
  AccordionGroup,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/joy";
import {
  Train,
  DirectionsCar,
  MergeType,
  TrendingUp,
  Coronavirus,
} from "@mui/icons-material";
import indexStyles from "../styles/index.module.css";
import Keyfact from "@/components/Layout/Keyfact";
import Map from "@/components/MapComponents/Map";
import Comparison from "@/components/Layout/Comparison";
import FilterBox from "@/components/Layout/FilterBox";
import FederalStateBox from "@/components/Layout/FederalStateBox";
import TeamTile from "@/components/TeamTile";
import BarChartPT from "@/components/BaseCharts/ChartsPT/BarChartPT";
import BarChartPTDev from "@/components/BaseCharts/ChartsPT/BarChartPTDevelopment";
import BarChartCar from "@/components/BaseCharts/ChartsCars/BarChartCar";
import BarChartCarDev from "@/components/BaseCharts/ChartsCars/BarChartCarDevelopment";
import LineChartPT from "@/components/BaseCharts/ChartsPT/LineChartPT";
import LineChartCar from "@/components/BaseCharts/ChartsCars/LineChartCar";
import BarChartDevelopmentCombined from "@/components/BaseCharts/ChartsCombined/BarChartDevelopmentCombined";
import BarChartCombined from "@/components/BaseCharts/ChartsCombined/BarChartCombined";
import pTData from "../data/pT.json";
import carData from "../data/car.json";
import popData from "../data/population.json";
import ProjectArea from "@/components/ProjectSection/ProjectArea";
import ToolBar from "@/components/KeyFindings/ToolBar";
import TransportShift from "@/components/KeyFindings/TransportShift/TransportShift";
import { max } from "d3";

type HomeProps = {
  currentSection: number;
  setSection: (section: number) => void;
};

export enum KeyFinding {
  None = "NONE",
  Shift = "SHIFT",
  Covid = "COVID",
}

const Home: React.FC<HomeProps> = ({ currentSection, setSection }) => {
  const [currentKeyFinding, setCurrentKeyFinding] = useState<KeyFinding>(
    KeyFinding.None
  );
  const sectionOffsets: number[] = [];
  const introSectionRef = useRef<HTMLDivElement>(null);
  const projectSectionRef = useRef<HTMLDivElement>(null);
  const insightsSectionRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const keyFindingSectionRef = useRef<HTMLDivElement>(null);
  const keyFindingDetailSectionRef = useRef<HTMLDivElement>(null);
  const scrollShiftFactor = 100;

  useEffect(() => {
    sectionOffsets.push(introSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(projectSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(keyFindingSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(insightsSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(teamSectionRef.current?.offsetTop || 0);
    sectionOffsets.push(keyFindingDetailSectionRef.current?.offsetTop || 0);

    const scrollHandleSection = () => {
      const position = window.scrollY;
      let currentSec = 0;

      // Dynamically check each section's position
      if (
        introSectionRef.current &&
        position >= introSectionRef.current.offsetTop
      )
        currentSec = 0;
      if (
        projectSectionRef.current &&
        position >= projectSectionRef.current.offsetTop
      )
        currentSec = 1;
      if (
        keyFindingSectionRef.current &&
        position >= keyFindingSectionRef.current.offsetTop
      )
        currentSec = 2;
      if (
        keyFindingDetailSectionRef.current &&
        position >= keyFindingDetailSectionRef.current.offsetTop
      )
        currentSec = 3;
      if (
        teamSectionRef.current &&
        position >= teamSectionRef.current.offsetTop
      )
        currentSec = 4;
      if (
        insightsSectionRef.current &&
        position >= insightsSectionRef.current.offsetTop
      )
        currentSec = 5;

      setSection(currentSec);
      console.log(currentSec);
    };

    window.addEventListener("scroll", scrollHandleSection);

    return () => {
      window.removeEventListener("scroll", scrollHandleSection);
    };
  }, []);

  const updateKeyFinding = (keyFinding: KeyFinding) => {
    setCurrentKeyFinding(keyFinding);
  };

  const renderKeyFinding = () => {
    switch (currentKeyFinding) {
      case KeyFinding.Shift:
        return <div></div>;
      case KeyFinding.Covid:
        return <div>Covid Component</div>;
      case KeyFinding.None:
      default:
        return <div>Select a key finding to see more details.</div>;
    }
  };

  return (
    <>
      <Stack direction={"column"} mx={13} my={7}>
        <ChapterArea>
          <Stack
            direction="column"
            className={indexStyles.headingStack}
            ref={introSectionRef}
          >
            {/* SVG with line background */}
            <svg
              className={indexStyles.headingSvg}
              viewBox="0 0 1000 200"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="580"
                y="50"
                width="80"
                height="30"
                rx="15"
                className={indexStyles.stationCircleHeadingSvg}
              />
              <text
                x="598"
                y="70.5"
                className={indexStyles.stationTextHeadingSvg}
              >
                InfoVis
              </text>
              <polyline
                points="660,65 960,65 995,105 995,200 960,240 25,240 3,270 5,590"
                className={indexStyles.lineHeadingSvg}
              />
            </svg>
            <img
              src={"/train.svg"}
              alt="train"
              className={indexStyles.trainSvg}
            />

            <div className="column">
              <Typography level="h1" className={indexStyles.titleHeading}>
                Visualizing the transportation <br /> shift in Germany
              </Typography>
              <br />
              <Typography level="h2" mt={2}>
                Comparing the usage of public transport and cars for <br /> the
                years from 2013 to 2022 across all federal states.
              </Typography>
            </div>
          </Stack>
        </ChapterArea>

        <ChapterArea>
          <Stack
            direction={"column"}
            id="project"
            mt={7}
            className={indexStyles.lineLeftStack}
            ref={projectSectionRef}
          >
            <div style={{ minHeight: "100px" }}></div>
            <Typography
              level="h2"
              className={
                currentSection == 1
                  ? indexStyles.markerLeftHeadingActive
                  : indexStyles.markerLeftHeading
              }
            >
              Project
            </Typography>
            <ProjectArea></ProjectArea>
          </Stack>
        </ChapterArea>

        <ChapterArea>
          <Stack
            direction={"column"}
            id="keyFinding"
            mt={7}
            className={indexStyles.lineLeftStack}
            ref={keyFindingSectionRef}
          >
            <div style={{ minHeight: "100px" }}></div>
            <Typography
              level="h2"
              className={
                currentSection == 2
                  ? indexStyles.markerLeftHeadingActive
                  : indexStyles.markerLeftHeading
              }
            >
              Key Finding
            </Typography>
            <Typography mt={2}>
              To continue select a specific key finding in order to take a
              deeper dive into our data!
            </Typography>
            <Stack direction={"row"} mt={2} spacing={2}>
              <Card sx={{ width: "30%" }}>
                <CardCover></CardCover>
                <CardContent>
                  <Typography level="h3">🚉 Transportaion Shift</Typography>
                  <Typography>
                    See how transportation has evolved in resent years. Take a
                    deeper look at how public transportaion and cars compete.
                  </Typography>
                  <div style={{ height: "100%" }}></div>
                  <Button
                    onClick={() => {
                      setCurrentKeyFinding(KeyFinding.Shift);
                      setSection(3);
                    }}
                    sx={{ width: "115px", mt: 2 }}
                  >
                    <a
                      href="#keyFindingDetail"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Take a look!
                    </a>
                  </Button>
                </CardContent>
              </Card>
              <Card sx={{ width: "30%" }}>
                <CardCover></CardCover>
                <CardContent>
                  <Typography level="h3">🦠 COVID</Typography>
                  <Typography>
                    Due to the COVID-19 pandemic, the usage of public
                    transportation has decreased significantly.
                  </Typography>
                  <div style={{ height: "100%" }}></div>
                  <Button
                    onClick={() => {
                      setCurrentKeyFinding(KeyFinding.Covid);
                      setSection(3);
                    }}
                    sx={{ width: "115px", mt: 2 }}
                  >
                    <a
                      href="#keyFindingDetail"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Take a look!
                    </a>
                  </Button>
                </CardContent>
              </Card>
              <Card sx={{ width: "30%" }}>
                <CardCover></CardCover>
                <CardContent>
                  <Typography level="h3">🚗 Cars in Germany</Typography>
                  <Typography>
                    Germany is known for its car industry. But how many cars are
                    actually on the road? How many people own a car? How many
                    people use public transportation?
                  </Typography>
                  <div style={{ height: "100%" }}></div>
                  <Button sx={{ width: "115px", mt: 2 }}>Take a look!</Button>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </ChapterArea>

        {currentKeyFinding == KeyFinding.None ? (
          <></>
        ) : (
          <div>
            <ChapterArea>
              <Stack
                direction={"column"}
                id="keyFindingDetail"
                mt={7}
                className={indexStyles.lineLeftStack}
                ref={keyFindingDetailSectionRef}
              >
                <div style={{ minHeight: "100px" }}></div>
                {/*@ts-ignore*/}
                <ToolBar
                  currentSection={currentSection}
                  keyFinding={currentKeyFinding}
                  onUpdateKeyFinding={updateKeyFinding}
                />
                <Typography
                  level="h2"
                  className={
                    currentSection == 3
                      ? indexStyles.markerLeftHeadingActive
                      : indexStyles.markerLeftHeading
                  }
                >
                  {currentKeyFinding == KeyFinding.Shift
                    ? "🚉 Transportation Shift"
                    : ""}
                  {currentKeyFinding == KeyFinding.Covid ? "🦠 COVID" : ""}
                </Typography>
                <Typography mt={2}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. 
                </Typography>
                <TransportShift />
                {renderKeyFinding()} {/*use this late to clean code*/}
              </Stack>
            </ChapterArea>
          </div>
        )}

        <ChapterArea>
          <Stack
            direction={"column"}
            mt={7}
            className={indexStyles.lineLeftHalfAcrossStack}
            ref={teamSectionRef}
          >
            <Typography
              level="h2"
              id="team"
              className={
                currentSection == 3
                  ? indexStyles.markerLeftHeadingActive
                  : indexStyles.markerLeftHeading
              }
            >
              Team
            </Typography>
            <Stack
              mt={3}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              flexWrap="wrap"
              gap={15}
            >
              <TeamTile
                className={indexStyles.teamTileTop}
                imageSrc={"/amiin.png"}
                name="Amiin Najjar"
                desc="HCI student with a passion for sport and cooking, I've swapped public transportation for pedaling my bike, blending tech insights with a dash of culinary creativity and a healthy dose of physical activity."
              />
              <TeamTile
                className={indexStyles.teamTileTop}
                imageSrc={"/lukas.png"}
                name="Lukas Plenk"
                desc="I’m a Human-Computer-Interaction student at LMU Munich interested in digital media, culture, and traveling. Just like public transport, I’m always out for the next destination ahead."
              />
              <TeamTile
                className={indexStyles.teamTileTop}
                imageSrc={"/tim.png"}
                name="Timothy Summers"
                desc="I love collaborating in a team and solving creative challenges! Always ready for adventure - I can even handle Munich public transportation during rush hour!"
              />
              <TeamTile
                className={indexStyles.teamTileBottom}
                imageSrc={"/malek.png"}
                name="Malek Jarraya"
                desc="I’m a Media Informatics student at LMU Munich. I love colors, the sun, and the sea. I didn't know much about public transportation in the past, but our project definitely changed that."
              />
              <TeamTile
                className={indexStyles.teamTileBottom}
                imageSrc={"/maxi.png"}
                name="Maximilian Wiegand"
                desc="Hey, I'm a media computer science student at LMU Munich. I love to design, develop and explore - not only for computers. Some ideas even came up in delayed and overcrowded public transport…"
              />
            </Stack>
          </Stack>
        </ChapterArea>

        <Typography level="h2">🛠️ Legacy Components</Typography>
        <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
          <Accordion>
            <AccordionSummary>Map</AccordionSummary>
            <AccordionDetails>
            <Stack direction={"column"}>
              <Typography level="h3" mt={4}>
                Our Key Findings
              </Typography>
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
              <Typography level="h3" mt={4}>
                Explore Yourself
              </Typography>
              <Stack direction={"row"} mt={2}>
                <Stack direction={"column"}>
                  <FilterBox />
                  <FederalStateBox />
                </Stack>
                <Map />
              </Stack>
              <Comparison />
            </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>Charts</AccordionSummary>
            <AccordionDetails>
            <Typography level="h3" mt={4} startDecorator={<Train />}>
              Insights: <i>&nbsp;Public Transportation</i>
            </Typography>
            <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
              <Accordion>
                <AccordionSummary>
                  Total PT Data in specific Year
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <BarChartPT data={pTData} populationData={popData} />
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  Total PT Data development over Time
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <LineChartPT data={pTData} />
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  Total PT Data change over Interval
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3, minWidth: "100%" }}>
                    <BarChartPTDev data={pTData} />
                  </Card>
                </AccordionDetails>
              </Accordion>
            </AccordionGroup>

            <Typography level="h3" mt={4} startDecorator={<DirectionsCar />}>
              Insights: <i>&nbsp;Cars</i>
            </Typography>
            <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
              <Accordion>
                <AccordionSummary>Car Data in specific Year</AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <BarChartCar data={carData} populationData={popData} />
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  Car Data development over Time
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <LineChartCar data={carData} />
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  Car Data change over Interval
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <BarChartCarDev data={carData} />
                  </Card>
                </AccordionDetails>
              </Accordion>
            </AccordionGroup>

            <Typography level="h3" mt={4} startDecorator={<MergeType />}>
              Insights: <i>&nbsp;Combining Data Sets</i>
            </Typography>
            <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
              <Accordion>
                <AccordionSummary>
                  Combined Data development over Time
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <BarChartDevelopmentCombined
                      carData={carData}
                      transportData={pTData}
                    />
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  Combined Data in specific Year
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ my: 3 }}>
                    <BarChartCombined
                      carData={carData}
                      transportData={pTData}
                      populationData={popData}
                    />
                  </Card>
                </AccordionDetails>
              </Accordion>
            </AccordionGroup>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </Stack>
    </>
  );
};

export default Home;
