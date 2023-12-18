import React, { useEffect, useRef, useState } from "react";
import {Stack} from "@mui/joy";
import ProjectArea from "@/components/ProjectSection/ProjectArea";
import ToolBar from "@/components/KeyFindings/ToolBar";
import TransportShift from "@/components/KeyFindings/TransportShift/TransportShift";
import Covid from "@/components/KeyFindings/Covid/Covid";
import IntroSection from "@/components/IntroSection";
import KeyFindingsSection from "@/components/KeyFindings/KeyFindingsSection";
import TeamSection from "@/components/TeamSection";
import BaseChartsSection from "@/components/BaseCharts/BaseChartsSection";

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
  const sectionOffsets: number[] = [];
  const introSectionRef = useRef<HTMLDivElement>(null);
  const projectSectionRef = useRef<HTMLDivElement>(null);
  const insightsSectionRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const keyFindingSectionRef = useRef<HTMLDivElement>(null);
  const keyFindingDetailSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHandleSection = () => {
      // refresh needed due to potentially changed page layout 
      sectionOffsets[0] = introSectionRef.current?.offsetTop || -1;
      sectionOffsets[1] = projectSectionRef.current?.offsetTop || -1;
      sectionOffsets[2] = keyFindingSectionRef.current?.offsetTop || -1;
      sectionOffsets[3] = keyFindingDetailSectionRef.current?.offsetTop || -1;
      sectionOffsets[4] = teamSectionRef.current?.offsetTop || -1;
      sectionOffsets[5] = insightsSectionRef.current?.offsetTop || -1;

      // get visible frame
      const windowFrameTop = window.scrollY;
      const windowFrameBottom = window.scrollY + window.innerHeight;
      let currentSec = currentSection;

      // get highest section visible
      sectionOffsets.forEach((el, i) => {
        if (el >= windowFrameTop && el <= windowFrameBottom) {
          currentSec = i;
        }
      });

      // set section
      setSection(currentSec);
    };

    window.addEventListener("scroll", scrollHandleSection);

    return () => {
      window.removeEventListener("scroll", scrollHandleSection);
    };
  }, []);

  const updateKeyFinding = (keyFinding: KeyFinding) => {
    setCurrentKeyFinding(keyFinding);
  };

  const renderKeyFinding = () => {
    switch (currentKeyFinding) {
      case KeyFinding.Shift:
        return <div>
          <TransportShift />
        </div>;
      case KeyFinding.Covid:
        return <div>
          <Covid />
        </div>;
      case KeyFinding.None:
      default:
        return <div>Select a key finding to see more details.</div>;
    }
  };

  return (
    <>
      <Stack direction={"column"} mx={8} my={7}>
        <IntroSection />
        <ProjectArea />
        <KeyFindingsSection />

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

        <TeamSection />
        <BaseChartsSection />
        
      </Stack>
    </>
  );
};

export default Home;
