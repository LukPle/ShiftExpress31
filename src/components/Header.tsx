import { Link, Stack, Typography, Button, Divider } from "@mui/joy"
import headerStyles from '../styles/header.module.css';

export default function Header({currentSection, setSection}) {
  return (
    <div className={headerStyles.stickyHeader}>
      <Stack direction="column" sx={{ mt: "10px", width: "100%" }} alignContent={"flex-start"}>
        <Stack direction="row" alignItems={"center"} alignContent={"flex-start"} sx={{ mb: "10px", paddingX: "30px" }} gap={3}>
          <Typography level="h2">Logo</Typography>
          <div style={{ flexGrow: 1 }} />
          <Typography level="h3">
            <Link href="#" underline="hover" onClick={() => setSection(0)}>
              Intro
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#project" underline="hover" onClick={() => setSection(1)}>
              Project
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#insights" underline="hover" onClick={() => setSection(2)}>
              Insights and Map
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#team" underline="hover" onClick={() => setSection(3)}>
              Team
            </Link>
          </Typography>
        </Stack>
        <Divider />
      </Stack>
    </div>
  )
}
