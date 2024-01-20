import { Card, Stack, Typography } from "@mui/joy";
import teamTileStyles from 'src/styles/teamTiles.module.css';

// Define a type for the props
type TeamTileProps = {
  className: string;
  name: string;
  imageSrc: string;
  desc: string;
};

// Use the type for the component's props
export default function TeamTile({ className, name, imageSrc, desc }: TeamTileProps) {
    return (
      <Card
          className={teamTileStyles.teamTile + ' ' + className} 
          sx={{
            width: 350,
            height: '80%'
          }}
      >
        <Stack direction={"column"} gap={2}>
          <Stack direction={"row"} gap={1}>
            <img src={imageSrc} alt={name} className={teamTileStyles.teamTileImage}/>
            <Typography level="h2" className={teamTileStyles.teamTileTitle}>{name}</Typography>
          </Stack>
          <Typography mt={1} className={teamTileStyles.teamTileDesc}>{desc}</Typography>
          <div style={{ height: "100%" }}></div>
        </Stack>  
      </Card>
    );
}
