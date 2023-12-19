import theme from '@/utils/theme';
import { Stack, Typography, Divider } from '@mui/joy';
import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlsFilterProps {
}

const SegmentedControlsFilter: React.FC<SegmentedControlsFilterProps> = ({ }) => {
    const items = ["Show Public Transport", "Show Cars",];
    const [currentIndex, setCurrentIndex] = useState(0);

    const getControlContainerSytle: React.CSSProperties = {
        backgroundColor: 'EFEFF0',
        display: 'inline-flex',
        padding: '5px',
        columnGap: '5px',
        borderRadius: '15px',
        boxShadow: 'inset 0 0px 8px 0 rgba(0, 0, 0, 0.12), 0 0 1px 0 rgba(0, 0, 0, 0.04)',
    };

    const getControlItemStyle = (isActive: boolean): React.CSSProperties => {
        return {
            backgroundColor: isActive ? theme.palette.primary[500] : 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderRadius: '10px',
            cursor: 'pointer',
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '12px',
            paddingRight: '12px',
        };
    };

    return (
        <Stack direction={'row'} justifyContent={'space-evenly'} divider={<Divider orientation='vertical'/>} style={getControlContainerSytle}>
            {items.map((item, index) => {
                return <motion.div layoutId={'1'} style={getControlItemStyle(currentIndex === index)} onClick={() => setCurrentIndex(index)}>
                            <Typography textColor={currentIndex === index ? 'white' : '#03045e'} fontWeight={currentIndex === index ? 'lg' : 'md'}>{item}</Typography>
                       </motion.div>
            })}
        </Stack>
    );
};

export default SegmentedControlsFilter;