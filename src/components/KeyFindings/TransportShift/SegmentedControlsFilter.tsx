import theme from '@/utils/theme';
import { Stack, Typography, Divider } from '@mui/joy';
import React, { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlsFilterProps {
    items: string[];
    onChange: (index: number, item: string) => void;
}

const SegmentedControlsFilter: React.FC<SegmentedControlsFilterProps> = React.memo(({ items, onChange }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        onChange(currentIndex, items[currentIndex]);
    }, [currentIndex]);

    const getControlContainerSytle: React.CSSProperties = {
        backgroundColor: 'EFEFF0',
        display: 'inline-flex',
        padding: '6px',
        columnGap: '6px',
        borderRadius: '15px',
        boxShadow: 'inset 0 0px 8px 0 rgba(0, 0, 0, 0.12), 0 0 1px 0 rgba(0, 0, 0, 0.04)',
        minHeight: '27.5px',
        marginBottom: '15px',
    };

    const getControlItemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: '10px',
        position: 'relative',
        cursor: 'pointer',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '8px',
        paddingRight: '8px',
    };

    const getItemBackgroundStyle: React.CSSProperties = {
        backgroundColor: theme.palette.primary[500],
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.12) 0 0px 1px 0 rgba(0, 0, 0, 0.04)',
        transition: 'background-color 0.1s ease',
    };


    return (
        <Stack direction={'row'} justifyContent={'space-evenly'} divider={<Divider orientation='vertical'/>} style={getControlContainerSytle}>
            {items.map((item, index) => {
                return (
                    <div key={index} style={getControlItemStyle} onClick={() => setCurrentIndex(index)}>
                        {currentIndex === index ? <motion.div layoutId={'1'} style={getItemBackgroundStyle}></motion.div> : null}
                        <Typography position={'relative'} zIndex={1} textColor={currentIndex === index ? 'white' : '#03045e'} fontWeight={currentIndex === index ? 'lg' : 'sm'}>{item}</Typography>
                    </div>
                );
            })}
        </Stack>
    );
});

SegmentedControlsFilter.displayName = 'SegmentedControlsFilter';

export default SegmentedControlsFilter;