import React from 'react';

interface MetricViewProps {
    color: string;
    text: string;
}

const MetricView: React.FC<MetricViewProps> = ({ color, text }) => {
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
        <div style={pillStyle}>
            <div style={content}>
                <div style={circleStyle}></div>
                <span>{text}</span>
            </div>
        </div>
    );
};

export default MetricView;
