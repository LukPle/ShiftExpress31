import { Link, Stack, Typography, Button, Divider } from "@mui/joy"
import headerStyles from '../styles/header.module.css';

export default function Header() {
  return (
    <div className={headerStyles.stickyHeader}>
      <Stack direction="column" sx={{ mt: "10px", width: "100%" }} alignContent={"flex-start"}>
        <Stack direction="row" alignItems={"center"} alignContent={"flex-start"} sx={{ mb: "10px", paddingX: "30px" }} gap={3}>
          <Typography level="h2">Logo</Typography>
          <div style={{ flexGrow: 1 }} />
          <Typography level="h3">
            <Link href="#" underline="hover">
              Intro
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#" underline="hover">
              Project
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#" underline="hover">
              Insights and Map
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#" underline="hover">
              Team
            </Link>
          </Typography>
        </Stack>
        <Divider />
      </Stack>
    </div>
  )
}
