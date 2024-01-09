import theme from '@/utils/theme';
import { Stack, Typography, Divider } from '@mui/joy';
import React, { ReactNode } from 'react';
import { FilterOptions } from './TransportShift';

interface GroupedBarChartLegendProps {
    currentOption: FilterOptions,
}

const GroupedBarChartLegend: React.FC<GroupedBarChartLegendProps> = ({ currentOption }) => {
    const ptColor = theme.palette.primary[500];
    const carColor = 'rgba(60, 27, 24, 0.5)';
    const unfocusedColor = '#E8E8E8';

    const getRectangleStyle = (color: string): React.CSSProperties => {
        return {
            width: '30px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '10%',
            marginRight: '10px',
            border: '1px solid #BFBFBF',
        };
    };

    return (
        <Stack direction="row" >
            <div style={getRectangleStyle(currentOption === FilterOptions.FocusCars ? unfocusedColor : ptColor)}></div>
            <Typography>🚈</Typography>
            <Divider orientation="vertical" sx={{mx:2}}/>
            <div style={getRectangleStyle(currentOption === FilterOptions.FocusPublicTransport ? unfocusedColor : carColor)}></div>
            <Typography>🚗</Typography>
        </Stack>
    );
};

export default GroupedBarChartLegend;