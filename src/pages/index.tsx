import { Card, Typography, Stack, Button } from "@mui/joy"
import indexStyles from '../styles/index.module.css';
import headerStyles from '../styles/header.module.css';
import Keyfact from "@/components/Keyfact";
import Map from "@/components/Map";
import Comparison from "@/components/Comparison";
import FilterBox from "@/components/FilterBox";
import FederalStateBox from "@/components/FederalStateBox";

/*
  The main structure is a column stack.
  Each station (Intro, Project, etc) is built as a row stack comprising of the vertical line
  and the content of the station, which itsself is a column stack that starts with a title of
  the section.
  The visualizations are imported into this file from the components folder, where each
  component is implemented (for example the Map component)
*/

export default function Home() {
  return (
    <Stack direction={"column"}>

      <Stack direction="column">
        <Typography level="h1">Visualizing the transportation shift in Germany</Typography>
        <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Typography>
      </Stack>

      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <div className={indexStyles.ring}></div>
          <div className={indexStyles.colorLine} style={{backgroundColor: "#56B9E3"}}></div>
        </Stack>
        <Stack direction={"column"} id="project">
          <Typography level="h2">Project</Typography>
          <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo do</Typography>
        </Stack>
      </Stack>
      
      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <div className={indexStyles.ring}></div>
          <div className={indexStyles.colorLine} style={{backgroundColor: "#84BE55", height: "1000px"}}></div>
        </Stack>
        <Stack direction={"column"} id="insights">
          <Typography level="h2">Insights and Map</Typography>
          <Stack direction={"column"}>
            <Typography level="h3">Our Key Findings</Typography>
            <Stack 
              direction={"row"}
              justifyContent="space-evenly"
              alignItems="center"
              spacing={4}
            >
              <Keyfact />
              <Keyfact />
              <Keyfact />
            </Stack>
          </Stack>

          <Stack direction={"column"}>
            <Typography level="h3">Explore Yourself</Typography>
            <Stack direction={"row"}>
              <Stack direction={"column"}>
                <FilterBox />
                <FederalStateBox />
              </Stack>
              <Map />
            </Stack>
            <Comparison />
          </Stack>
        </Stack>
      </Stack>

      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <div className={indexStyles.ring}></div>
          <div className={indexStyles.colorLine} style={{backgroundColor: "#8A237E"}}></div>
        </Stack>
        <Stack direction={"column"}>
            <Typography level="h2" id="team">Team</Typography>
            <Card
              variant="outlined"
              sx={{
              width: 800,
              height: 200
              }}
            >
            </Card>
        </Stack>
      </Stack>
    </Stack>

  )
}
