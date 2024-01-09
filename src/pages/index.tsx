import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/joy";
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

  const renderKeyFinding = () => {
    switch (currentKeyFinding) {
      case KeyFinding.Shift:
        return <Section title="🚉 Transportation Shift" onInViewChange={setIsKeyFindingSectionInView} style={{display: "flow-root"}}>
          <TransportShift />
        </Section>;
      case KeyFinding.Covid:
        return <Section title="🦠 Covid" onInViewChange={setIsKeyFindingSectionInView} style={{display: "flow-root"}}>
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
