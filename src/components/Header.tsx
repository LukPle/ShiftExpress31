import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, Stack, Typography, Button, Divider } from "@mui/joy"
import headerStyles from '../styles/header.module.css';
import { motion } from 'framer-motion';

//@ts-ignore
const MotionUnderline = ({ left, width }) => (
  <motion.div
    style={{
      height: "2px",
      backgroundColor: "#030456",
      position: "absolute",
      bottom: "1px",
      left: 1100,
    }}
    animate={{ left, width }}
    transition={{ type: "spring", stiffness: 100 }}
  />
);


export default function Header({ currentSection, setSection }: { currentSection: number, setSection: (section: number) => void }) {
  const introRef = useRef(null);
  const projectRef = useRef(null);
  const insightsRef = useRef(null);
  const teamRef = useRef(null);

  const [underlineProps, setUnderlineProps] = useState({ left: 1100, width: 0 });

  //@ts-ignore
  const scrollToSection = (sectionId) => {
    // Get the scroll container, adjust selector as needed
    const scrollContainer = document.querySelector('.snappingContainer');

    // Temporarily disable scroll snapping
    if (scrollContainer) {
      //@ts-ignore
      scrollContainer.style.scrollSnapType = 'none';
    }

    // Find the section and perform smooth scroll
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Wait for the scroll to finish, then re-enable scroll snapping
      // Estimate time for the scroll to finish (e.g., 1000 milliseconds)
      setTimeout(() => {
        if (scrollContainer) {
          //@ts-ignore
          scrollContainer.style.scrollSnapType = 'y mandatory';
        }
      }, 1000); // Adjust the time as needed
    }
  }

  const updateUnderlinePosition = useCallback(() => {
    let activeLinkRef;
    switch (currentSection) {
      case 0: activeLinkRef = introRef; break;
      case 1: activeLinkRef = projectRef; break;
      case 2: activeLinkRef = insightsRef; break;
      case 3: activeLinkRef = teamRef; break;
      default: activeLinkRef = null;
    }

    if (activeLinkRef && activeLinkRef.current) {
      const { offsetLeft, clientWidth } = activeLinkRef.current;
      setUnderlineProps({ left: offsetLeft, width: clientWidth });
    }
  }, [currentSection]);

  useEffect(() => {
    updateUnderlinePosition();
  }, [updateUnderlinePosition, currentSection]);

  useEffect(() => {
    const handleResize = () => {
      updateUnderlinePosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateUnderlinePosition]);

  return (
    <div className={headerStyles.stickyHeader}>
      <Stack direction="column" sx={{ mt: "10px", width: "100%" }} alignContent={"flex-start"}>
        <Stack direction="row" alignItems={"center"} alignContent={"flex-start"} sx={{ mb: "10px", paddingX: "21px" }} gap={3}>
          <a href="#" onClick={() => scrollToSection("intro")}>
            <img src={'/logo.svg'} alt="Shift Express 31 Logo" className={headerStyles.logoSVG} />
          </a>
          <div style={{ flexGrow: 1 }} />
          <Typography level="h3" ref={introRef}>
            <a href="#" className={headerStyles.link} onClick={() => scrollToSection("intro")}>
              Intro
            </a>
          </Typography>
          <Typography level="h3" ref={projectRef}>
            <a href="#" className={headerStyles.link} onClick={() => scrollToSection("project")}>
              Project
            </a>
          </Typography>
          <Typography level="h3" ref={insightsRef}>
            <a href="#" className={headerStyles.link} onClick={() => scrollToSection("insights")}>
              Key Insights
            </a>
          </Typography>
          <Typography level="h3" ref={teamRef}>
            <a href="#" className={headerStyles.link} onClick={() => scrollToSection("team")}>
              Team
            </a>
          </Typography>
        </Stack>
        <MotionUnderline {...underlineProps} />
        <Divider />
      </Stack>
    </div>
  )
}
