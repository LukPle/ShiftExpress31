import { Card, Typography } from "@mui/joy";
import Image from 'next/image';
import teamTileStyles from '../styles/teamTiles.module.css';

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
            width: 300,
            height: 200
          }}
      >
        <Image src={imageSrc} alt={name} className={teamTileStyles.teamTileImage} layout='fill'/>
        <Typography level="h2" className={teamTileStyles.teamTileTitle}>{name}</Typography>
        <Typography mt={1} className={teamTileStyles.teamTileDesc}>{desc}</Typography>
      </Card>
    );
}
