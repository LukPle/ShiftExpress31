import React, { ReactNode } from 'react';
import projectSectionStyles from 'src/styles/projectSection.module.css';
import { Card, Stack, Typography } from '@mui/joy';


const ProjectArea: React.FC = () => {
  const presentationImage = '/presentation.jpg';
  const workImage = '/work.jpeg';
  const groupImage = '/group.jpeg';

  const backgroundDescription = 'Our project visualizes the ongoing transportation shift in Germany, focusing on the development of public transportation and car usage over the past years, using data from the Federal Statistical Office of Germany. The main research question is whether a shift has happened and when significant changes took place. The graphics also cover which federal states were successful in the extension of their public transportation offering and which not.';
  const relevanceDescription = 'In a time where environmental sustainability and the transition in transportation is a hot topic, this project addresses a subject frequently debated in news and politics. With a focus on providing transparent and detailed insights, the project aims to cut through the rhetoric, offering a clear understanding of how the shift in transportation has unfolded over recent years and where big changes were happening.';
  const objectivesDescription = 'Through comprehensive data analyzation, we found several insights and selected the most interesting ones. We put them in fully explorable key findings that showcase these insights inside a dashboard of multiple visualizations. All of these key findings have a timeline in which you can traverse through several selected years and a map that provides an overview where changes did happened and what regional differences are observeable.';

  return (
    <Stack direction="row" minWidth={"100%"} minHeight={"70vh"} py={5} gap={2}>
      <Stack direction={'column'} width={"100%"} gap={2}>
        <Card sx={{ height: "100%" }}>
          <Typography level='h3'>🔍 Background</Typography>
          <Typography level='body-sm' sx={{ color: "#000" }}>{backgroundDescription}</Typography>
        </Card>
        <Card sx={{ height: "100%" }}>
          <Typography level='h3'>✨ Relevance</Typography>
          <Typography level='body-sm' sx={{ color: "#000" }}>{backgroundDescription}</Typography>
        </Card>
        <Card sx={{ height: "100%" }}>
          <Typography level='h3'>🎯 Objectives</Typography>
          <Typography level='body-sm' sx={{ color: "#000" }}>{backgroundDescription}</Typography>
        </Card>
      </Stack>
      <Card sx={{ minWidth: "40%" }}>
        <div style={{position: "relative"}}>
          <img src={presentationImage} className={projectSectionStyles.teamImage} style={{top: "120px", right:"30px", width:"300px"}}/>
          <img src={workImage} className={projectSectionStyles.teamImage} style={{top: "30px", left:"30px", width:"200px"}}/>
          <img src={groupImage} className={projectSectionStyles.teamImage} style={{top: "320px", left:"50px", width:"250px"}}/>
        </div>
      </Card>
    </Stack>
  );
};

export default ProjectArea;
