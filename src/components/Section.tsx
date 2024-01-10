// Section.tsx
import React, { useEffect } from 'react';
import { Typography, } from "@mui/joy";
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onInViewChange?: (inView: boolean) => void;
  halfAcrossLine?: Boolean;
  id?: string;
  style?: React.CSSProperties;
  introSection?: Boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, onInViewChange, halfAcrossLine, id, style, introSection }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    onInViewChange?.(inView); // Trigger the callback whenever inView changes
  }, [inView, onInViewChange]);

  return (
    <div ref={ref} style={style} className={`${styles.snappingSection} ${halfAcrossLine ? styles.lineLeftHalfAcrossStack : styles.lineLeftStack}`} id={id ? id : ""}>
      <Typography level="h2" className={`${styles.heading} ${inView ? styles.headingActive : ""} ${introSection ? styles.headingIntroSection : ""}`} marginTop={"20px"}>{title}</Typography>
      {children}
    </div>
  );
};

export default Section;
