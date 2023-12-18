import React from 'react';
import { Typography, } from "@mui/joy";

interface IntroSectionProps {
    // Add any props here
}

const IntroSection: React.FC<IntroSectionProps> = () => {
    return (
        <div>
            <Typography level="h1">
                Visualizing the transportation <br /> shift in Germany
            </Typography>
            <br />
            <Typography level="h2">
                Comparing the usage of public transport and cars for <br /> the
                years from 2013 to 2022 across all federal states.
            </Typography>
        </div>
    );
};

export default IntroSection;
