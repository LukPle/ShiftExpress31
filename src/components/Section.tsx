// Section.tsx
import React, { useEffect } from 'react';
import { Typography, } from "@mui/joy";
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onInViewChange?: (inView: boolean) => void;
  id?: string;
  style?: React.CSSProperties;
  introSection?: Boolean;
  teamSection?: Boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, onInViewChange, id, style, introSection, teamSection }) => {
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
        <Typography level="h2" className={`${styles.heading} ${inView ? styles.headingActive : ""}`} marginTop={"20px"}>{title}</Typography>
      )
      }
      {children}
    </div>
  );
};

export default Section;
