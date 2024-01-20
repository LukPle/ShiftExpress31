// Section.tsx
import React, { useEffect } from 'react';
import { Button, Stack, Typography, } from "@mui/joy";
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";
import { ArrowUpward } from '@mui/icons-material';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onInViewChange?: (inView: boolean) => void;
  id?: string;
  style?: React.CSSProperties;
  introSection?: Boolean;
  teamSection?: Boolean;
  keyFindingSection?: Boolean
  scrollToSection?: (sectionId: any) => void;
}

const Section: React.FC<SectionProps> = ({ title, children, onInViewChange, id, style, introSection, teamSection, keyFindingSection, scrollToSection }) => {
  const { ref, inView } = useInView({
    threshold: 0.9,
  });

  useEffect(() => {
    onInViewChange?.(inView); // Trigger the callback whenever inView changes
  }, [inView, onInViewChange]);

  return (
    <div ref={ref} style={style} className={`${styles.snappingSection} ${!teamSection && ! introSection ? styles.lineLeftStack : (introSection ? styles.introSection : styles.footerSection)}`} id={id ? id : ""}>
      {introSection ? (
        <></>
        ) : (
        <Stack direction="row" justifyContent="space-between">
          <Typography level="h2" className={`${styles.heading} ${inView ? styles.headingActive : ""}`}>{title}</Typography>
          {keyFindingSection ? <Button onClick={() => scrollToSection!('insights')} sx={{ mt: "20px" }} endDecorator={<ArrowUpward/>}>Back to Keyfindings</Button> : null}
        </Stack>
      )
      }
      {children}
    </div>
  );
};

export default Section;
