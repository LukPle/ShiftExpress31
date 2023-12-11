import { Stack, Typography } from '@mui/joy';
import projectSectionStyles from 'src/styles/projectSection.module.css';
import 'src/styles/projectSection.module.css';

interface TextColumnProps {
    title: string;
    description: string;
    icon: string;
    isBig: boolean;
}

const TextColumn: React.FC<TextColumnProps> = ({ title, description, icon, isBig }) => {
  return (
    <Stack direction="column" alignItems="center" className={projectSectionStyles.textColumn}>
        <div className={projectSectionStyles.zStack}>
            <Typography noWrap={false} level="h4" className={projectSectionStyles.title}>{title}</Typography>
            <img src={icon} alt="" className={isBig ? projectSectionStyles.leadingIconBig : projectSectionStyles.leadingIconSmall} />
        </div>
        <Typography className={projectSectionStyles.description}>{description}</Typography>
    </Stack>
  );
};

export default TextColumn;