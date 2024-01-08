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
        return <Section title="🚉 Transportation Shift" onInViewChange={setIsKeyFindingSectionInView}>
          <TransportShift />
        </Section>;
      case KeyFinding.Covid:
        return <Section title="🦠 Covid" onInViewChange={setIsKeyFindingSectionInView}>
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
        <Section title="">
          <IntroSection />
        </Section>
        <Section title="Introduction">
          <ProjectArea />
        </Section>
        <Section title="What do you want to research?">
          <KeyFindingsSection keyFinding={currentKeyFinding} onUpdateKeyFinding={updateKeyFinding} />
        </Section>

        <div id='keyFinding'>
        {currentKeyFinding == KeyFinding.None ? (
          <></>
        ) : (
          <div>
            {/*<ToolBar
              isSpecificSectionInView={isKeyFindingSectionInView}
              keyFinding={currentKeyFinding}
              onUpdateKeyFinding={updateKeyFinding}
            />*/}
            {renderKeyFinding()}
          </div>
        )}
        </div>

        <Section title="Who are we?">
          <TeamSection />
        </Section>

        <Section title="🛠️ Legacy Components">
          <BaseChartsSection />
        </Section>

      </Stack>
    </div>
  );
};

export default Home;
