import React, {} from 'react';
import { getFlagProperty } from './FlagSwitchUtil';

interface TooltipProps {
    tooltipPosition: {x: number; y: number;}
    tooltipState: string;
    tooltipContent: any;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltipPosition, tooltipState, tooltipContent }) => {

    const getTooltipContainerStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${tooltipPosition.x}px`,   
        top: `${tooltipPosition.y}px`,
        backgroundColor: 'white',
        padding: '7.5px',
        border: '1px solid black',
        borderRadius: '10px',
        pointerEvents: 'none' // Important to not interfere with map interaction
    };

    const getUpperRowStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'start',
        marginBottom: '10px',
    };


    return (
        <div style={getTooltipContainerStyle}>
            <div
                style={getUpperRowStyle}>
                <img src={getFlagProperty(tooltipState)} alt="flag" style={{ width: '35px', height: '22.5px', marginRight: '10px', border: '1px solid black', borderRadius: '5px',}} />
                {tooltipState}
            </div>
            {tooltipContent}
        </div>
    );
};

export default Tooltip;