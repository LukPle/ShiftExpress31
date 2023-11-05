import { Typography, Stack } from "@mui/joy"
import indexStyles from '../styles/index.module.css';

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
      <Stack direction={"column"} p={10} alignItems="center" width="100%">
        <Typography level="h2">Here could be our code!</Typography>
      </Stack>
    </Stack>
  )
}
