import theme from '@/utils/theme';
import { Stack, Typography, Divider } from '@mui/joy';
import React from 'react';
import { FilterOptions as FilterOptionTSCovid } from '../TransportShift/TransportShift';
import { FilterOptions as FilterOptionsCars } from '../Cars/Cars';
import InteractionTooltip from '@/components/InteractionTooltip';

interface GroupedBarChartLegendProps {
    currentOption: FilterOptionTSCovid | FilterOptionsCars,
    isCarKeyFinding?: boolean,
}

const GroupedBarChartLegend: React.FC<GroupedBarChartLegendProps> = ({ currentOption, isCarKeyFinding = false }) => {
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

    const isFocusedPT = (): boolean => {
        if (isCarKeyFinding) {
            return currentOption === FilterOptionsCars.Comparison
        } else {
            return currentOption != FilterOptionTSCovid.FocusCars;
        }
    }

    const isFocusedCars = (): boolean => {
        if (isCarKeyFinding) {
            return true;
        } else {
            return currentOption != FilterOptionTSCovid.FocusPublicTransport;
        }
    }

    return (
        <Stack direction="row" >
            <InteractionTooltip tooltipText={'Public Transport'} delay={0}><div style={getRectangleStyle(isFocusedPT() ? ptColor : unfocusedColor)}></div></InteractionTooltip>
            <Typography>🚊</Typography>
            <Divider orientation="vertical" sx={{mx:2}}/>
            <InteractionTooltip tooltipText={'Cars'} delay={0}><div style={getRectangleStyle(isFocusedCars() ? carColor : unfocusedColor)}></div></InteractionTooltip>
            <Typography>🚗</Typography>
        </Stack>
    );
};

export default GroupedBarChartLegend;