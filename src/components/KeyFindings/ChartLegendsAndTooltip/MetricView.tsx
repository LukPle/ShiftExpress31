import InteractionTooltip from '@/components/InteractionTooltip';
import React from 'react';

interface MetricViewProps {
    color: string;
    text: string;
    isPT: boolean;
}

const MetricView: React.FC<MetricViewProps> = ({ color, text, isPT }) => {
    const pillStyle = {
        backgroundColor: `${color}50`,
        borderRadius: "16px"
    };

    const circleStyle = {
        height: "12px",
        width: "12px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "inline-block",
        marginRight: "7px",
    };

    const content = {
        padding: '2px 10px',
    };

    return (
        <InteractionTooltip tooltipText={isPT ? 'Public Transport' : 'Cars'} delay={0}>
            <div style={pillStyle}>
                <div style={content}>
                    <div style={circleStyle}></div>
                    <span>{text}</span>
                </div>
            </div>
        </InteractionTooltip>
    );
};

export default MetricView;
