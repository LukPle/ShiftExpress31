import { Card, Typography } from "@mui/joy"
import Image from 'next/image';
import teamTileStyles from '../styles/teamTiles.module.css';

export default function TeamTile({className, name, imageSrc, desc}) {
    return (
      <Card
          className={teamTileStyles.teamTile + ' ' + className} 
          sx={{
          width: 300,
          height: 200
      }}
      >
        <Image src={imageSrc} alt={name} className={teamTileStyles.teamTileImage}/>
        <Typography level="h2" className={teamTileStyles.teamTileTitle}>{name}</Typography>
        <Typography mt={1} className={teamTileStyles.teamTileDesc}>{desc}</Typography>
      </Card>
    )
}