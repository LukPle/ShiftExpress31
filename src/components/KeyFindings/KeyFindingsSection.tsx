import React from 'react';
import { Typography, Stack, Card, CardCover, CardContent, Button } from "@mui/joy";
import { KeyFinding } from '../../pages/index';
import styles from '../../styles/index.module.css'; // Need this for scrolling

interface KeyFindingsSectionProps {
  keyFinding: KeyFinding;
  onUpdateKeyFinding: (keyFinding: KeyFinding) => void;
}

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

const KeyFindingsSection: React.FC<KeyFindingsSectionProps> = ({keyFinding, onUpdateKeyFinding}) => {
  return (
    <div>
      <Typography mt={2}>
        To continue select a specific key finding in order to take a
        deeper dive into our data!
      </Typography>
      <Stack direction={"row"} mt={2} spacing={2}>
        <Card sx={{ width: "30%" }}>
          <CardCover></CardCover>
          <CardContent>
            <Typography level="h3">🚉 Transportaion Shift</Typography>
            <Typography>
              See how transportation has evolved in resent years. Take a
              deeper look at how public transportaion and cars compete.
            </Typography>
            <div style={{ height: "100%" }}></div>
            <Button
              sx={{ width: "115px", mt: 2 }}
              onClick={() => {
                onUpdateKeyFinding(KeyFinding.Shift)
                scrollToSection('keyFinding')
              }}
            >
              <a
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Take a look!
              </a>
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ width: "30%" }}>
          <CardCover></CardCover>
          <CardContent>
            <Typography level="h3">🦠 COVID</Typography>
            <Typography>
              Due to the COVID-19 pandemic, the usage of public
              transportation has decreased significantly.
            </Typography>
            <div style={{ height: "100%" }}></div>
            <Button
              sx={{ width: "115px", mt: 2 }}
              onClick={() => {
                onUpdateKeyFinding(KeyFinding.Covid)
                scrollToSection('keyFinding')
              }}
            >
              <a
                href="#keyFindingDetail"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Take a look!
              </a>
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ width: "30%" }}>
          <CardCover></CardCover>
          <CardContent>
            <Typography level="h3">🚗 Cars in Germany</Typography>
            <Typography>
              Germany is known for its car industry. But how many cars are
              actually on the road? How many people own a car? How many
              people use public transportation?
            </Typography>
            <div style={{ height: "100%" }}></div>
            <Button sx={{ width: "115px", mt: 2 }}>Take a look!</Button>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
};

export default KeyFindingsSection;
