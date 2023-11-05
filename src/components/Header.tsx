import { Stack, Typography, Button, Divider } from "@mui/joy"
import headerStyles from '../styles/header.module.css';

export default function Header() {
  return (
    <div className={headerStyles.stickyHeader}>
      <Stack direction="column" sx={{ mt: "10px", width: "100%" }} alignContent={"flex-start"}>
        <Stack direction="row" alignItems={"center"} alignContent={"flex-start"} sx={{ mb: "10px", paddingX: "30px" }} gap={3}>
          <Typography level="h2">InfoVis</Typography>
          <div className={headerStyles.badgeContainer}>
            <div className={headerStyles.badge}>WS23</div>
          </div>
          <div style={{ flexGrow: 1 }} />
          <div className={headerStyles.badgeContainer2}>
            <div className={headerStyles.badge2} style={{backgroundColor: "#56B9E3"}}>1</div>
          </div>
          <Typography level="h3">Intro</Typography>
          <div className={headerStyles.badgeContainer2}>
            <div className={headerStyles.badge2} style={{backgroundColor: "#84BE55"}}>2</div>
          </div>
          <Typography level="h3">Project</Typography>
          <div className={headerStyles.badgeContainer2}>
            <div className={headerStyles.badge2} style={{backgroundColor: "#8A237E"}}>3</div>
          </div>
          <Typography level="h3">Insights</Typography>
          <div className={headerStyles.badgeContainer2}>
            <div className={headerStyles.badge2} style={{backgroundColor: "#D12D26"}}>4</div>
          </div>
          <Typography level="h3">Team</Typography>
        </Stack>
        <Divider />
      </Stack>
    </div>
  )
}
