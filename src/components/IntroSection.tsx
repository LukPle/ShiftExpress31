import React from 'react';
import { Typography, Stack } from "@mui/joy";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";

interface IntroSectionProps {
    // Add any props here
}

const IntroSection: React.FC<IntroSectionProps> = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    React.useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const variants = {
        visible: { x: -500, opacity: 1, transition: { duration: 1 } },
        hidden: { x: 500, opacity: 0 },
    };

    return (
        <Stack ref={ref} style={{height: "100%", paddingTop: "65px", paddingBottom: "65px", boxSizing: "border-box"}}>
            <Typography level="h1" sx={{ fontSize: '5rem' }} >
                Visualizing the transportation <br /> shift in Germany
            </Typography>

            <Typography level="h3" mt="40px">
                Comparing the usage of public transport and cars for <br /> the
                years from 2013 to 2022 across all federal states.
            </Typography>

            <motion.img 
                src='/train.svg' 
                className={styles.introTrainImage}
                initial="hidden"
                animate={controls}
                variants={variants}
            />
            <div className={styles.introStationDot}></div>
        </Stack>
    );
};

export default IntroSection;
