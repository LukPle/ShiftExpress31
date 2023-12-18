import theme from '@/utils/theme';
import { Stack, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';


const GroupedBarChartLegend: React.FC = () => {
    const ptColor = theme.palette.primary[500];
    const carColor = 'rgba(60, 27, 24, 0.5)';

    const getRectangleStyle = (color: string, isSecond: boolean): React.CSSProperties => {
        return {
            width: '30px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '10%',
            marginRight: '10px',
            marginLeft: isSecond ? '30px' : '0px',
        };
    };

    return (
        <Stack direction="row">
            <div style={getRectangleStyle(ptColor, false)}></div>
            <Typography>🚈 Change of usage in %</Typography>
            <div style={getRectangleStyle(carColor, true)}></div>
            <Typography>🚗 Change of usage in %</Typography>
        </Stack>
    );
};

export default GroupedBarChartLegend;