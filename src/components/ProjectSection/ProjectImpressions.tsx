import React, { ReactNode } from 'react';
import projectSectionStyles from 'src/styles/projectSection.module.css';
import { Stack } from '@mui/joy';

const ProjectImpressions: React.FC = () => {
  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" className={projectSectionStyles.impressionRow}>
        <img src='/work.jpeg' className={`${projectSectionStyles.impressionImage} ${projectSectionStyles.edgeImage}`}/>
        <img src='/group.jpeg' className={projectSectionStyles.impressionImage}/>
        <img src='/presentation.jpg' className={`${projectSectionStyles.impressionImage} ${projectSectionStyles.edgeImage}`}/>
    </Stack>
  );
};

export default ProjectImpressions;