import { Card, Typography, Stack } from "@mui/joy"
import indexStyles from '../styles/index.module.css';
import headerStyles from '../styles/header.module.css';
import Keyfact from "@/components/Keyfact";
import Map from "@/components/Map";
import Comparison from "@/components/Comparison";

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
        <Stack direction={"column"}>
          <Typography level="h2">Project</Typography>
          <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo do</Typography>
        </Stack>
      </Stack>
      
      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <div className={indexStyles.ring}></div>
          <div className={indexStyles.colorLine} style={{backgroundColor: "#84BE55"}}></div>
        </Stack>
        <Stack direction={"column"}>
          <Typography level="h2">Insights and Map</Typography>
          <Stack direction={"column"}>
            <Typography level="h3">Our Key Findings</Typography>
            <Stack direction={"row"}>
              <Keyfact />
              <Keyfact />
              <Keyfact />
            </Stack>
          </Stack>

          <Stack direction={"column"}>
            <Typography level="h3">Explore Yourself</Typography>
            <Stack direction={"row"}>
              <Stack direction={"column"}>
                <Card></Card>
                <Card></Card>
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
            <Typography level="h2">Team</Typography>
            <Card></Card>
        </Stack>
      </Stack>
    </Stack>

  )
}
