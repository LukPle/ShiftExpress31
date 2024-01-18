import React, { ReactNode } from 'react';
import projectSectionStyles from 'src/styles/projectSection.module.css';
import TextColumn from './TextColumn';
import { Divider, Stack } from '@mui/joy';
import ProjectImpressions from './ProjectImpressions';

const ProjectArea: React.FC = () => {
  const backgroundIcon = '/background.svg';
  const relevanceIcon = '/relevance.svg';
  const objectivesIcon = '/objectives.svg';

  const backgroundDescription = 'Our project visualizes the ongoing transportation shift in Germany, focusing on the development of public transportation and car usage over the past years, using data from the Federal Statistical Office of Germany. The main research question is whether a shift has happened and when significant changes took place. The graphics also cover which federal states were successful in the extension of their public transportation offering and which not.';
  const relevanceDescription = 'In a time where environmental sustainability and the transition in transportation is a hot topic, this project addresses a subject frequently debated in news and politics. With a focus on providing transparent and detailed insights, the project aims to cut through the rhetoric, offering a clear understanding of how the shift in transportation has unfolded over recent years and where big changes were happening.';
  const objectivesDescription = 'Through comprehensive data analyzation, we found several insights and selected the most interesting ones. We put them in fully explorable key findings that showcase these insights inside a dashboard of multiple visualizations. All of these key findings have a timeline in which you can traverse through several selected years and a map that provides an overview where changes did happened and what regional differences are observeable.';

  return (
    <Stack direction="column">
      <Stack direction="row" divider={<Divider orientation="vertical" />} justifyContent="space-between" alignItems="flex-start" className={projectSectionStyles.projectRow} sx={{minWidth: "100%"}}>
        <TextColumn title='Background' description={backgroundDescription} icon={backgroundIcon} isBig={false}>
          <img src='/work.jpeg' className={`${projectSectionStyles.impressionImage}`}/>
          </TextColumn>
        <TextColumn title='Relevance' description={relevanceDescription} icon={relevanceIcon} isBig={true}>
          <img src='/group.jpeg' className={projectSectionStyles.impressionImage}/>
        </TextColumn>
        <TextColumn title='Objectives' description={objectivesDescription} icon={objectivesIcon} isBig={false}>
          <img src='/presentation.jpg' className={`${projectSectionStyles.impressionImage}`}/>
        </TextColumn>
      </Stack>
    </Stack>
  );
};

export default ProjectArea;
