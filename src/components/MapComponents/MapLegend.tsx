import theme from '@/utils/theme';
import { Divider, Stack, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';
import InteractionTooltip from '../InteractionTooltip';

interface MapLegendProps {
    isPT: boolean;
    paddingEnd: number;
}

const MapLegend: React.FC<MapLegendProps> = ({ isPT, paddingEnd }) => {
    const legendColor = isPT ? theme.palette.primary[500] : "#FFA500";
    const ptHeadline = "🚊 Change of usage in %";
    const carHeadline = "🚗 Change of usage in %";
    const radius = 7.5;

    const getColorColumnStyle: React.CSSProperties = {
        border: '1px solid #BFBFBF',
        borderRadius: radius,
    };

    const getRectangleStyle = (color: string, hasOpacity: boolean, isTopEdge: boolean, isBottomEdge: boolean): React.CSSProperties => {
        const opacityScore = hasOpacity ? 50 : 100;

        return {
            width: '45px',
            height: '25px',
            backgroundColor: color,
            opacity: opacityScore / 100,
            borderTopLeftRadius: isTopEdge ? radius : 0,
            borderTopRightRadius: isTopEdge ? radius : 0,
            borderBottomLeftRadius: isBottomEdge ? radius : 0,
            borderBottomRightRadius: isBottomEdge ? radius : 0,
        };
    };

    return (
        <Stack direction="column" maxWidth="100px" paddingBottom={paddingEnd + "px"}>
            <Typography marginTop="15px" paddingBottom="15px">{isPT ? ptHeadline : carHeadline}</Typography>
            <Stack direction="row">
                <Stack direction="column" justifyContent="space-evenly" alignItems="center" paddingRight="15px">
                    <Typography>{isPT ? '+40' : '+10'}</Typography>
                    <Typography>{isPT ? '+20' : '+5'}</Typography>
                    <Typography>0</Typography>
                    <Typography>{isPT ? '-20' : '-5'}</Typography>
                    <Typography>{isPT ? '-40' : '-10'}</Typography>
                </Stack>
                <InteractionTooltip tooltipText={`Color Scale for ${isPT ? 'Public Transport' : 'Cars'}`} delay={0} position={'bottom-start'}>
                    <Stack direction="column" divider={<Divider orientation="horizontal"/>} style={getColorColumnStyle}>
                        <div style={getRectangleStyle(legendColor, false, true, false)}></div>
                        <div style={getRectangleStyle(legendColor, true, false, false)}></div>
                        <div style={getRectangleStyle('#fff', false, false, false)}></div>
                        <div style={getRectangleStyle('#DD0606', true, false, false)}></div>
                        <div style={getRectangleStyle('#DD0606', false, false, true)}></div>
                    </Stack>
                </InteractionTooltip>
            </Stack>
        </Stack>
    );
};

export default MapLegend;