import React from 'react';
import { Typography, Stack } from "@mui/joy";
import styles from "@/styles/index.module.css";

interface IntroSectionProps {
    // Add any props here
}

const IntroSection: React.FC<IntroSectionProps> = () => {
    return (
        <Stack style={{height: "100%", paddingTop: "65px", paddingBottom: "65px", boxSizing: "border-box"}} justifyContent="space-between">
            <Typography level="h1" sx={{ fontSize: '5rem' }} >
                Visualizing the transportation <br /> shift in Germany
            </Typography>

            <img src='/train.svg' className={styles.introTrainImage}/>
            <div className={styles.introStationDot}></div>

            <Typography level="h3">
                Comparing the usage of public transport and cars for <br /> the
                years from 2013 to 2022 across all federal states.
            </Typography>
        </Stack>
    );
};

export default IntroSection;
