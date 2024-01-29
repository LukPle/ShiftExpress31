import theme from '@/utils/theme';
import { Stack, Typography, Divider } from '@mui/joy';
import React from 'react';
import { FilterOptions as FilterOptionTSCovid } from '../TransportShift/TransportShift';
import { FilterOptions as FilterOptionsCars } from '../Cars/Cars';
import InteractionTooltip from '@/components/InteractionTooltip';
import MetricView from './MetricView';

interface GroupedBarChartLegendProps {
    currentOption: FilterOptionTSCovid | FilterOptionsCars,
    isCarKeyFinding?: boolean,
    carText: string,
    ptText: string,
}

const GroupedBarChartLegend: React.FC<GroupedBarChartLegendProps> = ({ currentOption, isCarKeyFinding = false, carText, ptText }) => {
    const ptColor = "#9BC4FD";
    const carColor = '#FFA500';
    const unfocusedColor = '#CCCCCC';

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
        <Stack direction="row" alignItems="center">
            <MetricView color={isFocusedPT() ? ptColor : unfocusedColor} text={ptText} isPT={true} opacity={isFocusedPT() ? 1 : 0.5}/>
            <Divider orientation="vertical" sx={{ mx: 1 }} />
            <MetricView color={isFocusedCars() ? carColor : unfocusedColor} text={carText} isPT={false} opacity={isFocusedCars() ? 1 : 0.5}/>
        </Stack>
    );
};

export default GroupedBarChartLegend;