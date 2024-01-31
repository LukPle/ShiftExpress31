import React from 'react';
import { Grid,  } from "@mui/joy";
import TeamTile from './TeamTile';
import styles from 'src/styles/index.module.css';

interface TeamSectionProps {
    // Add any props you need for the component here;
}

const TeamSection: React.FC<TeamSectionProps> = () => {
    return (
        <Grid container columns={6} rowSpacing={15} marginTop={0} className={styles.teamSection} padding={0}>
            <Grid xs={2} className={styles.teamTileGridTop} padding={0}>
                <TeamTile
                    className={styles.teamTileTop}
                    imageSrc={"/lukas.png"}
                    name="Lukas Plenk"
                    desc="I’m a Human-Computer-Interaction student at LMU Munich interested in digital media, culture, and traveling. Just like public transport, I’m always out for the next destination ahead."
                    badges={["Subway Surfer", "E-Scooter", "Cyclist"]}
                    stravaCyclistLink='https://www.strava.com/athletes/lukas_plenk'
                />
            </Grid>
            <Grid xs={2} className={styles.teamTileGridTop}>
                <TeamTile
                    className={styles.teamTileTop}
                    imageSrc={"/amiin.png"}
                    name="Amiin Najjar"
                    desc="HCI student with a passion for sport and cooking, swapped public transportation for pedaling my bike, blending tech with a dash of culinary creativity and a healthy dose of physical activity."
                    badges={["Cyclist", "Runner"]}
                    stravaCyclistLink='https://strava.app.link/iRs5ufTAOGb'
                />
            </Grid>
            <Grid xs={2} className={styles.teamTileGridTop}>
                <TeamTile
                    className={styles.teamTileTop}
                    imageSrc={"/tim.png"}
                    name="Timothy Summers"
                    desc="I love collaborating in a team and solving creative challenges! Always ready for adventure - I can even handle Munich public transportation during rush hour!"
                    badges={["Uber XL", "Tier Bike"]}
                />
            </Grid>
            <Grid xs={3} className={styles.teamTileGridBottom}>
                <TeamTile
                    className={styles.teamTileBottom}
                    imageSrc={"/malek.png"}
                    name="Malek Jarraya"
                    desc="I’m a Media Informatics student at LMU Munich. I love colors, the sun, and the sea. I didn't know much about public transportation in the past, but our project definitely changed that."
                    badges={['Passenger Seat DJ', 'Subway Regular']}
                />
            </Grid>
            <Grid xs={3} className={styles.teamTileGridBottom}>
                <TeamTile
                    className={styles.teamTileBottom}
                    imageSrc={"/maxi.png"}
                    name="Maximilian Wiegand"
                    desc="Hey, I'm a media computer science student at LMU Munich. I love to design, develop and explore. Some ideas even came up in delayed and overcrowded public transport …"
                    badges={["Public-transport approved"]}
                />
            </Grid>
            
            <div className={styles.footerStationDot}></div>
        </Grid>
    );
};

export default TeamSection;
