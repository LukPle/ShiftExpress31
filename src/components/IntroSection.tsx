import React, { useState } from 'react';
import { Typography, Stack } from "@mui/joy";
import { delay, motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";
import {Copyright} from "@mui/icons-material";
import InteractionTooltip from './InteractionTooltip';

interface IntroSectionProps {
    // Add any props here
}

const IntroSection: React.FC<IntroSectionProps> = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
    const [animationTriggered, setAnimationTriggered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    React.useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
        
        if (animationTriggered) {
            setIsAnimating(true);
            controls.start("hidden").then(() => {
                controls.start("visible");
                setAnimationTriggered(false);
                setIsAnimating(false);
            });
        }
    }, [controls, inView, animationTriggered]);

    const variants = {
        visible: { x: -500, opacity: 1, transition: { duration: 1 } },
        hidden: { x: 500, opacity: 0, transition: { duration: 1 } },
    };

    const handleTrainClick = () => {
        if (!isAnimating) {
            setAnimationTriggered(true);
        }
    };

    return (
        <Stack ref={ref} className={styles.introSectionContainer}>
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

            <InteractionTooltip tooltipText={'Let Me Drive!'} delay={1000}><motion.img
                src='/train.svg'
                className={styles.introTrainImage}
                initial="hidden"
                animate={controls}
                variants={variants}
                onClick={() => handleTrainClick()}
            /></InteractionTooltip>
            
            {/**<div className={styles.introStationDot}></div>/** */}

        <Typography level="body-sm" mt="auto" startDecorator={<Copyright />}>
            <span style={{ color: "#030456" }}>
                LMU &#x2022; Course: Information Visualization &#x2022; Team 31: 
            </span>
            &nbsp;
            <a 
                style={{ color: 'inherit', textDecoration: 'none' }} 
                target='_blank' 
                href='https://bento.me/lukasplenk'
                onMouseOver={(e) => { e.currentTarget.style.color = '#03045E'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'inherit'; }}
            >
                @LukasPlenk
            </a>
            &nbsp;
            <a 
                style={{ color: 'inherit', textDecoration: 'none' }} 
                target='_blank' 
                href='https://github.com/mj-on-git'
                onMouseOver={(e) => { e.currentTarget.style.color = '#03045E'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'inherit'; }}
            >
                @MalekJarraya
            </a>
            &nbsp;
            <a 
                style={{ color: 'inherit', textDecoration: 'none' }} 
                target='_blank' 
                href='https://github.com/najjar77'
                onMouseOver={(e) => { e.currentTarget.style.color = '#03045E'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'inherit'; }}
            >
                @AmiinNajjar
            </a>
            &nbsp;
            <a 
                style={{ color: 'inherit', textDecoration: 'none' }} 
                target='_blank' 
                href='https://www.timsum.net'
                onMouseOver={(e) => { e.currentTarget.style.color = '#03045E'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'inherit'; }}
            >
                @TimothySummers
            </a>
            &nbsp;
            <a 
                style={{ color: 'inherit', textDecoration: 'none' }} 
                target='_blank' 
                href='http://maxiw.de/'
                onMouseOver={(e) => { e.currentTarget.style.color = '#03045E'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'inherit'; }}
            >
                @MaximillianWiegand
            </a>
        </Typography>

        </Stack>
    );
};

export default IntroSection;
