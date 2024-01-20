import theme from '@/utils/theme';
import { Stack, Typography, Divider } from '@mui/joy';
import React from 'react';
import { FilterOptions } from '../TransportShift/TransportShift';
import InteractionTooltip from '@/components/InteractionTooltip';

interface GroupedBarChartLegendProps {
    currentOption: FilterOptions,
}

const GroupedBarChartLegend: React.FC<GroupedBarChartLegendProps> = ({ currentOption }) => {
    const ptColor = "#9BC4FD";
    const carColor = '#FFA500';
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
            <InteractionTooltip tooltipText={'Color for Public Transport'} delay={0}><div style={getRectangleStyle(currentOption === FilterOptions.FocusCars ? unfocusedColor : ptColor)}></div></InteractionTooltip>
            <Typography>🚈</Typography>
            <Divider orientation="vertical" sx={{mx:2}}/>
            <InteractionTooltip tooltipText={'Color for Cars'} delay={0}><div style={getRectangleStyle(currentOption === FilterOptions.FocusPublicTransport ? unfocusedColor : carColor)}></div></InteractionTooltip>
            <Typography>🚗</Typography>
        </Stack>
    );
};

export default GroupedBarChartLegend;