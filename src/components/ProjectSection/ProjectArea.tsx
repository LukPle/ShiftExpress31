import React, { ReactNode } from 'react';
import projectSectionStyles from 'src/styles/projectSection.module.css';
import { Card, Stack, Typography } from '@mui/joy';


const ProjectArea: React.FC = () => {
  const presentationImage = '/presentation.jpg';
  const workImage = '/work.jpeg';
  const groupImage = '/group.jpeg';

  const backgroundDescription = 'Our project visualizes the ongoing transportation shift in Germany, focusing on the development of public transportation and car usage over the past years, using data from the Federal Statistical Office of Germany combined with a dataset from an Insurance Platform. The main research question is whether a shift has occurred and when significant changes took place. The graphics also cover which federal states were successful in extending their public transportation offerings and which were not.';
  const relevanceDescription = 'In a time when environmental sustainability and the transition in transportation are hot topics, this project addresses a subject frequently debated in news and politics. With a focus on providing transparent and detailed insights, the project aims to cut through the rhetoric, offering a clear understanding of how the shift in transportation has unfolded over recent years and where significant changes have occurred.';
  const objectivesDescription = 'Through comprehensive data analysis, we found several insights and selected the most interesting ones. We placed them in a fully explorable set of key findings showcased within a dashboard of multiple visualizations. All of these key findings have a timeline that allows you to traverse through several selected years, a chart that provides clear insight into our findings, and a map that shows an overview of the regional differences.';

  return (
    <Stack direction="row" minWidth={"100%"} minHeight={"70vh"} py={5} gap={2}>
      <Stack direction={'column'} width={"100%"} gap={2}>
        <Card sx={{ height: "100%" }}>
          <Typography level='h3'>🔍 Background</Typography>
          <Typography level='body-sm' sx={{ color: "#000" }}>{backgroundDescription}</Typography>
        </Card>
        <Card sx={{ height: "100%" }}>
          <Typography level='h3'>✨ Relevance</Typography>
          <Typography level='body-sm' sx={{ color: "#000" }}>{relevanceDescription}</Typography>
        </Card>
        <Card sx={{ height: "100%" }}>
          <Typography level='h3'>🎯 Objectives</Typography>
          <Typography level='body-sm' sx={{ color: "#000" }}>{objectivesDescription}</Typography>
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
