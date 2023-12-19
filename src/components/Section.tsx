// Section.tsx
import React from 'react';
import { Typography, } from "@mui/joy";
import { useInView } from 'react-intersection-observer';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  return (
    <div ref={ref} style={{minHeight: "90vh"}}>
      <Typography level="h2" style={inView ? {color: "var(--joy-palette-text-tertiary)"} : {color: "var(--joy-palette-primary-500)"}}>{title}</Typography>
      {children}
    </div>
  );
};

export default Section;
