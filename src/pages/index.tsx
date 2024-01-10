import React, { useEffect, useRef, useState } from "react";
import { Button, Stack } from "@mui/joy";
import ProjectArea from "@/components/ProjectSection/ProjectArea";
import ToolBar from "@/components/KeyFindings/ToolBar";
import TransportShift from "@/components/KeyFindings/TransportShift/TransportShift";
import Covid from "@/components/KeyFindings/Covid/Covid";
import IntroSection from "@/components/IntroSection";
import KeyFindingsSection from "@/components/KeyFindings/KeyFindingsSection";
import TeamSection from "@/components/TeamSection";
import BaseChartsSection from "@/components/BaseCharts/BaseChartsSection";
import Section from "@/components/Section";
import styles from "@/styles/index.module.css";
import {
  ArrowUpward
} from "@mui/icons-material";


type HomeProps = {
  currentSection: number;
  setSection: (section: number) => void;
};

export enum KeyFinding {
  None = "NONE",
  Shift = "SHIFT",
  Covid = "COVID",
  CarCountry = "CAR_COUNTRY",
}

const Home: React.FC<HomeProps> = ({ currentSection, setSection }) => {
  const [currentKeyFinding, setCurrentKeyFinding] = useState<KeyFinding>(
    KeyFinding.None
  );
  const [isKeyFindingSectionInView, setIsKeyFindingSectionInView] = useState(false);

  const updateKeyFinding = (keyFinding: KeyFinding) => {
    setCurrentKeyFinding(keyFinding);
  };

  //@ts-ignore
  const scrollToSection = (sectionId) => {
    // Get the scroll container, adjust selector as needed
    const scrollContainer = document.querySelector(`.${styles.snappingContainer}`);
  
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

  const renderKeyFinding = () => {
    switch (currentKeyFinding) {
      case KeyFinding.Shift:
        return <Section title="🚉 Transportation Shift" onInViewChange={setIsKeyFindingSectionInView} style={{display: "flow-root"}}>
          <Button className={styles.backToKeyfindingBtn} onClick={() => scrollToSection('insights')} endDecorator={<ArrowUpward/>}>Back to Keyfindings</Button>
          <TransportShift />
        </Section>;
      case KeyFinding.Covid:
        return <Section title="🦠 Covid" onInViewChange={setIsKeyFindingSectionInView} style={{display: "flow-root"}}>
          <Button className={styles.backToKeyfindingBtn} onClick={() => scrollToSection('insights')} endDecorator={<ArrowUpward/>}>Back to Keyfindings</Button>
          <Covid />
        </Section>;
      case KeyFinding.None:
      default:
        return <div>Select a key finding to see more details.</div>;
    }
  };

  return (
    <div className={styles.snappingContainer}>
      <Stack direction={"column"} mx={12} my={7}>
        <Section title="" id="intro" onInViewChange={inView => {if (inView) {setSection(0)}}} introSection={true}>
          <IntroSection />
        </Section>
        <Section title="Introduction" id="project" onInViewChange={inView => {if (inView) {setSection(1)}}}>
          <ProjectArea />
        </Section>
        <Section title="What do you want to research?" id="insights" onInViewChange={inView => {if (inView) {setSection(2)}}}>
          <KeyFindingsSection keyFinding={currentKeyFinding} onUpdateKeyFinding={updateKeyFinding} />
        </Section>

        <div id='keyFinding' className={styles.snappingSectionKeyFinding}>
        {currentKeyFinding == KeyFinding.None ? (
          <></>
        ) : (
          renderKeyFinding()
        )}
        </div>

        <Section title="Who are we?" id="team" halfAcrossLine={true} onInViewChange={inView => {if (inView) {setSection(3)}}}>
          <TeamSection />
        </Section>

        <Section title="🛠️ Legacy Components" onInViewChange={inView => {if (inView) {setSection(4)}}}>
          <BaseChartsSection />
        </Section>

      </Stack>
    </div>
  );
};

export default Home;
