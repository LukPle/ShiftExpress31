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


type HomeProps = {
  currentSection: number;
  setSection: (section: number) => void;
};

export enum KeyFinding {
  None = "NONE",
  Shift = "SHIFT",
  Covid = "COVID",
}

const Home: React.FC<HomeProps> = ({ currentSection, setSection }) => {
  const [currentKeyFinding, setCurrentKeyFinding] = useState<KeyFinding>(
    KeyFinding.None
  );

  const updateKeyFinding = (keyFinding: KeyFinding) => {
    setCurrentKeyFinding(keyFinding);
  };

  const renderKeyFinding = () => {
    switch (currentKeyFinding) {
      case KeyFinding.Shift:
        return <Section title="Transportation Shift">
          <TransportShift />
        </Section>;
      case KeyFinding.Covid:
        return <Section title="Transportation Shift">
          <Covid />
        </Section>;
      case KeyFinding.None:
      default:
        return <div>Select a key finding to see more details.</div>;
    }
  };

  return (
    <>
      <Stack direction={"column"} mx={8} my={7}>

        <IntroSection />
        <Section title="Introduction">
          <ProjectArea />
        </Section>
        <Section title="What do you want to research?">
          <KeyFindingsSection />
        </Section>

        {currentKeyFinding == KeyFinding.None ? (
          <></>
        ) : (
          <div>
            <ToolBar
              currentSection={currentSection}
              keyFinding={currentKeyFinding}
              onUpdateKeyFinding={updateKeyFinding}
            />
            {renderKeyFinding()}
          </div>
        )}

        <Section title="Who are we?">
          <TeamSection />
        </Section>

        <Section title="🛠️ Legacy Components">
          <BaseChartsSection />
        </Section>

      </Stack>
    </>
  );
};

export default Home;
