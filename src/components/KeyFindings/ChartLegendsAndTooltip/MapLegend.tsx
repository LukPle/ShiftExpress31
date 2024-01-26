import theme from '@/utils/theme';
import { Divider, Stack, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';
import InteractionTooltip from '../../InteractionTooltip';

interface MapLegendProps {
  paddingEnd: number;
  tooltip?: string;
  headline?: string;
  scale: {text: string, color: string}[];
}

const MapLegend: React.FC<MapLegendProps> = ({ paddingEnd, tooltip, headline, scale }) => {
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
            <Typography marginTop="15px" paddingBottom="20px">{headline}</Typography>
            <Stack direction="row" alignItems={'center'}>
                <Stack direction="column" justifyContent="space-evenly" alignItems="center" paddingRight="15px">
                    <Typography sx={{fontVariantNumeric: "tabular-nums"}}>^</Typography>
                      {scale?.map((el, i) => 
                        <Typography key={i} sx={{fontVariantNumeric: "tabular-nums"}}>{el?.text}</Typography>
                      )}
                    <Typography sx={{fontVariantNumeric: "tabular-nums"}}>⌄</Typography>
                </Stack>
                <InteractionTooltip tooltipText={tooltip ?? ""} delay={0} position={'bottom-start'}>
                    <Stack direction="column" divider={<Divider orientation="horizontal"/>} style={getColorColumnStyle}>
                      {scale?.map((el, i) => 
                        <div key={i} style={getRectangleStyle(el?.color, false, i == 0, i == scale.length - 1)}></div>
                      )}
                    </Stack>
                </InteractionTooltip>
            </Stack>
        </Stack>
    );
};

export default MapLegend;