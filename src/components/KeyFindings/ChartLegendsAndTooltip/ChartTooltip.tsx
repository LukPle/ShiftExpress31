import React, {} from 'react';
import { getFlagProperty } from '../FlagSwitchUtil';

interface ChartTooltipProps {
    tooltipPosition: {x: number; y: number;}
    tooltipState: string;
    tooltipContent: any;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ tooltipPosition, tooltipState, tooltipContent }) => {

    const getTooltipContainerStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${tooltipPosition.x}px`,   
        top: `${tooltipPosition.y}px`,
        backgroundColor: 'white',
        padding: '7.5px',
        border: '1px solid #CFD7E0',
        borderRadius: '10px',
        pointerEvents: 'none', // Important to not interfere with map interaction
        zIndex: 1000,
    };

    const getUpperRowStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'start',
        marginBottom: '10px',
    };

    const tooltipContentDisplay = typeof tooltipContent === "string" ? tooltipContent?.split('\n').map((subStr: string) => (<>{subStr}<br /></>)) : tooltipContent;


    return (
        <div style={getTooltipContainerStyle}>
            <div
                style={getUpperRowStyle}>
                <img src={getFlagProperty(tooltipState)} alt="flag" style={{ width: '35px', height: '22.5px', marginRight: '10px', border: '1px solid black', borderRadius: '5px',}} />
                {tooltipState}
            </div>
            {tooltipContentDisplay}
        </div>
    );
};

export default ChartTooltip;