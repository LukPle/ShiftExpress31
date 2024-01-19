import { Tooltip } from '@mui/joy';
import React from 'react';

interface InteractionTooltipProps {
    tooltipText: string;
    delay: number;
    position?: "bottom" | "left" | "right" | "top" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "right-end" | "right-start" | "top-end" | "top-start";
    children: any;
}

const InteractionTooltip: React.FC<InteractionTooltipProps> = ({ tooltipText, delay, children, position='bottom' }) => {
    return (
        <Tooltip title={tooltipText} arrow enterDelay={delay} placement={position}>{children}</Tooltip>
    );
};

export default InteractionTooltip;