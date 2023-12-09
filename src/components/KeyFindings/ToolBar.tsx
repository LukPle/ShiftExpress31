import React, { useState, useEffect } from 'react';
import styles from '../../styles/toolPanel.module.css'; // Make sure to import the CSS file
import { Stack, Button, IconButton } from "@mui/joy";
import { Replay } from '@mui/icons-material';


type ToolProps = {
    currentSection: number;
    keyFinding: string;
};

const ToolPanel: React.FC<ToolProps> = ({ currentSection, keyFinding }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        // Define the section numbers where the panel should be open
        const sectionsWherePanelIsOpen = [3];

        if (sectionsWherePanelIsOpen.includes(currentSection)) {
            setIsPanelOpen(true);
        } else {
            setIsPanelOpen(false);
        }
    }, [currentSection]); // Dependency array includes currentSection to trigger the effect when it changes

    console.log("keyFinding: ", keyFinding);

    return (
        <>
            <div className={`${styles.toolPanel} ${isPanelOpen ? styles.open : ''}`}>
                <Stack direction={"row"} gap={2} sx={{ transform: "rotate(90deg)" }}>
                    <Button variant={keyFinding==="SHIFT" ? "solid" : "outlined"} sx={{ minWidth: "190px", maxHeight: "40px" }}>
                        🚉 &nbsp;Transportaion Shift
                    </Button>
                    <Button variant={keyFinding==="COVID" ? "solid" : "outlined"} sx={{ minWidth: "100px", maxHeight: "40px" }}>
                        🦠 &nbsp;COVID
                    </Button>
                    <Button variant="outlined" sx={{ minWidth: "170px", maxHeight: "40px" }}>
                        🚗 &nbsp;Cars in Germany
                    </Button>
                    <div style={{ minWidth: "10px" }}></div>
                    <IconButton variant="outlined">
                        <Replay sx={{ transform: "rotate(-90deg)" }} />
                    </IconButton>
                </Stack>
            </div>
        </>
    );
};

export default ToolPanel;
