import theme from '@/utils/theme';
import { Divider, Stack, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';

interface MapLegendProps {
    isPT: boolean;
    paddingEnd: number;
}

const MapLegend: React.FC<MapLegendProps> = ({ isPT, paddingEnd }) => {
    const legendColor = isPT ? theme.palette.primary[500] : "#8A760A";
    const ptHeadline = "🚈 Change of usage in %";
    const carHeadline = "🚗 Change of usage in %";
    const radius = 7.5;

    const getColorColumnStyle: React.CSSProperties = {
        border: '1px solid #BFBFBF',
        borderRadius: radius,
    };

    const getRectangleStyle = (opacity: number, isTopEdge: boolean, isBottomEdge: boolean): React.CSSProperties => {
        return {
            width: '45px',
            height: '25px',
            backgroundColor: legendColor,
            opacity: opacity / 100,
            borderTopLeftRadius: isTopEdge ? radius : 0,
            borderTopRightRadius: isTopEdge ? radius : 0,
            borderBottomLeftRadius: isBottomEdge ? radius : 0,
            borderBottomRightRadius: isBottomEdge ? radius : 0,
        };
    };

    return (
        <Stack direction="column" maxWidth="100px" paddingBottom={paddingEnd + "px"}>
            <Typography paddingBottom="15px">{isPT ? ptHeadline : carHeadline}</Typography>
            <Stack direction="row">
                <Stack direction="column" justifyContent="space-evenly" alignItems="center" paddingRight="15px">
                    <Typography>+50</Typography>
                    <Typography>+25</Typography>
                    <Typography>0</Typography>
                    <Typography>-25</Typography>
                    <Typography>-50</Typography>
                </Stack>
                <Stack direction="column" divider={<Divider orientation="horizontal"/>} style={getColorColumnStyle}>
                    <div style={getRectangleStyle(100, true, false)}></div>
                    <div style={getRectangleStyle(75, false, false)}></div>
                    <div style={getRectangleStyle(50, false, false)}></div>
                    <div style={getRectangleStyle(25, false, false)}></div>
                    <div style={getRectangleStyle(0, false, true)}></div>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default MapLegend;