import React from 'react';
import { Typography, } from "@mui/joy";
import ProjectImpressions from './ProjectSection/ProjectImpressions';

interface IntroSectionProps {
    // Add any props here
}

const IntroSection: React.FC<IntroSectionProps> = () => {
    return (
        <div style={{minHeight: "100vh", marginTop: "45px"}}>
            <Typography level="h1" sx={{ fontSize: '5rem' }}>
                Visualizing the transportation <br /> shift in Germany
            </Typography>
            <br />
            <Typography level="h3" style={{ marginTop: "30px" }}>
                Comparing the usage of public transport and cars for <br /> the
                years from 2013 to 2022 across all federal states.
            </Typography>
            <ProjectImpressions></ProjectImpressions>
        </div>
    );
};

export default IntroSection;
