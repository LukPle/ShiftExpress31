import React, { useState } from 'react';
import { Typography, Stack } from "@mui/joy";
import { delay, motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";
import {
    Copyright
} from "@mui/icons-material";

interface IntroSectionProps {
    // Add any props here
}

const IntroSection: React.FC<IntroSectionProps> = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [animationTriggered, setAnimationTriggered] = useState(false);

    React.useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
        console.log("triggered: " + animationTriggered);
        if (animationTriggered) {
            controls.start("hidden");
        }
        setTimeout(() => {
            controls.start("visible");
            setAnimationTriggered(false);
        }, 2000);
    }, [controls, inView, animationTriggered]);

    const variants = {
        visible: { x: -500, opacity: 1, transition: { duration: 1 } },
        hidden: { x: 500, opacity: 0, transition: { duration: 1 } },
    };

    return (
        <Stack ref={ref} style={{ height: "100%", paddingTop: "65px", paddingBottom: "65px", boxSizing: "border-box" }}>
            <Typography level="h1" sx={{ fontSize: '5rem' }} >
                Visualizing the transportation <br /> shift in Germany
            </Typography>

            <Typography level="h3" mt="40px">
                Comparing the usage of public transport and cars for <br /> the
                years from 2013 to 2022 across all federal states.
            </Typography>

            <img src='/tunnel.svg' className={styles.tunnel} />

            <div className={styles.tunnelHelper}></div>
            <div className={styles.tunnelHelper2}></div>

            <motion.img
                src='/train.svg'
                className={styles.introTrainImage}
                initial="hidden"
                animate={controls}
                variants={variants}
                onClick={() => { setAnimationTriggered(true) }}
            />
            <div className={styles.introStationDot}></div>

            <Typography level="body-sm" mt="320px" startDecorator={<Copyright />}><span style={{ color: "#030456" }}>LMU &#x2022; Course: Information-Visualisaton &#x2022; Team 31: </span>&nbsp;@LukasPlenk @MalekJarraya @AmiinNouri @MaximillianWiegand</Typography>

        </Stack>
    );
};

export default IntroSection;
