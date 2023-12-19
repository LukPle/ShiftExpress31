// Section.tsx
import React, { useEffect } from 'react';
import { Typography, } from "@mui/joy";
import { useInView } from 'react-intersection-observer';
import styles from "@/styles/index.module.css";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onInViewChange?: (inView: boolean) => void;
}

const Section: React.FC<SectionProps> = ({ title, children, onInViewChange }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    onInViewChange?.(inView); // Trigger the callback whenever inView changes
  }, [inView, onInViewChange]);

  return (
    <div ref={ref} style={{minHeight: "90vh"}} className={styles.snappingSection}>
      <Typography level="h2" style={inView ? {color: "var(--joy-palette-text-tertiary)"} : {color: "var(--joy-palette-primary-500)"}} paddingTop={"20px"}>{title}</Typography>
      {children}
    </div>
  );
};

export default Section;
