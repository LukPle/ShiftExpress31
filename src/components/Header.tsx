import { Link, Stack, Typography, Button, Divider } from "@mui/joy"
import headerStyles from '../styles/header.module.css';

export default function Header({currentSection, setSection}: {currentSection: number, setSection: (section: number) => void}) {
  return (
    <div className={headerStyles.stickyHeader}>
      <Stack direction="column" sx={{ mt: "10px", width: "100%" }} alignContent={"flex-start"}>
        <Stack direction="row" alignItems={"center"} alignContent={"flex-start"} sx={{ mb: "10px", paddingX: "21px" }} gap={3}>
          <img src={'/logo.svg'} alt="Shift Express 31 Logo" className={headerStyles.logoSVG} />
          <div style={{ flexGrow: 1 }} />
          <Typography level="h3">
            <Link href="#intro" underline={currentSection === 0 ? "always" : "none"}>
              Intro
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#project" underline={currentSection === 1 ? "always" : "none"}>
              Project
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#insights" underline={currentSection === 2 ? "always" : "none"}>
              Key Insights
            </Link>
          </Typography>
          <Typography level="h3">
            <Link href="#team" underline={currentSection === 3 ? "always" : "none"}>
              Team
            </Link>
          </Typography>
        </Stack>
        <Divider />
      </Stack>
    </div>
  )
}
