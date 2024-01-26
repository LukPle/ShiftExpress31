import theme from '@/utils/theme';
import { Stack, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';
import { ChartSorting } from '../TransportShift/CombinedDevTS';

interface GroupedBarChartLegendProps {
    currentSorting: ChartSorting,
}

const GroupedBarChartLegend: React.FC<GroupedBarChartLegendProps> = ({ currentSorting }) => {
    const ptColor = theme.palette.primary[500];
    const carColor = 'rgba(60, 27, 24, 0.5)';
    const unfocusedColor = '#E8E8E8';

    const getLegendRowStyle: React.CSSProperties = {
        marginTop: '15px',
    };

    const getRectangleStyle = (color: string, isSecond: boolean): React.CSSProperties => {
        return {
            width: '30px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '10%',
            marginRight: '10px',
            marginLeft: isSecond ? '30px' : '0px',
            border: '1px solid #BFBFBF',
        };
    };

    return (
        <Stack direction="row" style={getLegendRowStyle}>
            <div style={getRectangleStyle(currentSorting != ChartSorting.SortCars ? ptColor : unfocusedColor, false)}></div>
            <Typography>🚊 Change of usage in %</Typography>
            <div style={getRectangleStyle(currentSorting != ChartSorting.SortPublicTransport ? carColor : unfocusedColor, true)}></div>
            <Typography>🚗 Change of usage in %</Typography>
        </Stack>
    );
};

export default GroupedBarChartLegend;