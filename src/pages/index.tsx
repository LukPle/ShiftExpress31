import { Typography, Stack } from "@mui/joy"
import indexStyles from '../styles/index.module.css';
import headerStyles from '../styles/header.module.css';

export default function Home() {
  return (
    <Stack direction={"row"}>
      <Stack direction={"column"} my={10}>
      <div className={indexStyles.ring}></div>
      <div className={indexStyles.colorLine} style={{backgroundColor: "#56B9E3"}}></div>
      <div className={indexStyles.ring}></div>
      <div className={indexStyles.colorLine} style={{backgroundColor: "#84BE55"}}></div>
      <div className={indexStyles.ring}></div>
      <div className={indexStyles.colorLine} style={{backgroundColor: "#8A237E"}}></div>
      <div className={indexStyles.ring}></div>
      <div className={indexStyles.colorLine} style={{backgroundColor: "#D12D26"}}></div>
      </Stack>
      <Stack direction={"column"} width="100%" pt={8.5} pl={3}>
        <Stack direction={"row"} gap={3}>
        <div className={headerStyles.badgeContainer2}>
            <div className={headerStyles.badge2} style={{backgroundColor: "#56B9E3"}}>1</div>
          </div>
          <Typography level="h2">Intro</Typography>
        </Stack>
        <Typography><i>Here could be our code!</i></Typography>
      </Stack>
    </Stack>
  )
}
