import React from 'react';
import { Typography, Stack, Card, CardCover, CardContent, Button, CardOverflow, AspectRatio } from "@mui/joy";
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

const KeyFindingsSection: React.FC<KeyFindingsSectionProps> = ({ keyFinding, onUpdateKeyFinding }) => {
  return (
    <div>
      <Typography mt={2}>
        To continue, select a key finding you would like to explore!
      </Typography>
      <Stack direction={"row"} mt={2} spacing={2}>
        <Card sx={{ width: "30%" }}>
          <CardOverflow>
            <AspectRatio ratio="4">
              <img
                src="/teaserTS.jpg"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </CardOverflow>
          <CardContent sx={{ padding: 0.5 }}>
            <Typography level="h3" mt="0.5">🚉 Transportation Shift</Typography>
            <Typography mt={1.5} mb={1.5}>
            See how the usage of transportation means has evolved between 2013 and 2019.
            Take a deeper look at how public transportation and cars
            compete and examine which states were successful in
            their strategy for transportation shift and which not.
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
        <CardOverflow>
            <AspectRatio ratio="4">
              <img
                src="/teaserCovid.jpg"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </CardOverflow>
          <CardContent sx={{ padding: 0.5 }}>
            <Typography level="h3" mt="0.5">🦠 Covid Impact</Typography>
            <Typography mt={1.5} mb={1.5}>
              Due to the Covid-19 pandemic, the usage of public
              transportation has decreased significantly. Explore
              the impact of the pandemic on transportation in
              Germany between the years from 2019 to 2022.
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
        <CardOverflow>
            <AspectRatio ratio="4">
              <img
                src="/teaserCars.jpg"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </CardOverflow>
          <CardContent sx={{ padding: 0.5 }}>
            <Typography level="h3" mt="0.5">🚗 Cars in Germany</Typography>
            <Typography mt={1.5} mb={1.5}>
              Germany is well known for its car industry. But how
              much are people actually driving? Are there now more cars
              on the road than before? Check out how these metrics have
              evolved from 2013 to 2022, and examine the leading states in
              car usage.
            </Typography>
            <div style={{ height: "100%" }}></div>
            <Button
              sx={{ width: "115px", mt: 2 }}
              onClick={() => {
                onUpdateKeyFinding(KeyFinding.CarCountry)
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
      </Stack>
    </div>
  );
};

export default KeyFindingsSection;
