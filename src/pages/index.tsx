import { Card, Typography, Stack, Box } from "@mui/joy"
import indexStyles from '../styles/index.module.css';
import Keyfact from "@/components/Keyfact";
import Map from "@/components/Map";
import Comparison from "@/components/Comparison";
import FilterBox from "@/components/FilterBox";
import FederalStateBox from "@/components/FederalStateBox";
import { useEffect, useRef } from 'react';
import Image from 'next/image';

/*
  The main structure is a column stack.
  Each station (Intro, Project, etc) is built as a row stack comprising of the vertical line
  and the content of the station, which itsself is a column stack that starts with a title of
  the section.
  The visualizations are imported into this file from the components folder, where each
  component is implemented (for example the Map component)
*/

export default function Home({currentSection, setSection}) {
  let sectionOffsets = [];
  const introSectionRef = useRef();
  const projectSectionRef = useRef();
  const insightsSectionRef = useRef();
  const teamSectionRef = useRef();
  const scrollShiftFactor = 100;

  useEffect(() => {
    // store heights of sections
    sectionOffsets.push(introSectionRef?.current?.offsetTop);
    sectionOffsets.push(projectSectionRef?.current?.offsetTop);
    sectionOffsets.push(insightsSectionRef?.current?.offsetTop);
    sectionOffsets.push(teamSectionRef?.current?.offsetTop);

    window.addEventListener('scroll', scrollHandleSection);
  }, []);

  const scrollHandleSection = () => {
    const position = window.scrollY;
    const currentSecOffset = sectionOffsets.find((el) => el + scrollShiftFactor >= position);
    const currentSec = sectionOffsets.indexOf(currentSecOffset);

    setSection(currentSec);
  };

  return (
    <Stack direction={"column"} mx={17} my={7} >
      <Stack direction="column" className={indexStyles.headingStack} ref={introSectionRef}>
        {/* SVG with line background */}
        <svg className={indexStyles.headingSvg} viewBox="0 0 1000 200" version='1.1' xmlns='http://www.w3.org/2000/svg'>
          <rect x="410" y="65" width="80" height="30" rx="15" className={indexStyles.stationCircleHeadingSvg}/>
          <text x="427" y="85" className={indexStyles.stationTextHeadingSvg}>InfoViz</text>
          <polyline points="490,80 980,80 995,95 995,180 980,195 18,195 3,210 3,230" className={indexStyles.lineHeadingSvg} />
        </svg>
        <Image src={require('@/assets/train.svg')} alt="train" className={indexStyles.trainSvg}/>

        <Typography level="h1" className={indexStyles.titleHeading}>Visualizing the transportation <br/> shift in Germany</Typography>
        <Typography mt={2}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Typography>
      </Stack>


      <Stack direction={"column"} id="project" mt={7} className={indexStyles.lineLeftStack} ref={projectSectionRef}>
        <Typography level="h2" className={currentSection == 1 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Project</Typography>
        <Typography mt={2}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo do</Typography>
      </Stack>


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
      </Stack>

      
      <Stack direction={"column"} mt={7} className={indexStyles.lineLeftHalfAcrossStack} ref={teamSectionRef}>
        <Typography level="h2" id="team" className={currentSection == 3 ? indexStyles.markerLeftHeadingActive : indexStyles.markerLeftHeading}>Team</Typography>
        <Card
          variant="outlined"
          sx={{
            width: 800,
            height: 200,
            mt: 2
          }}
        >
        </Card>
      </Stack>
    </Stack>

  )
}
