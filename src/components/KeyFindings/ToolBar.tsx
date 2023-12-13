import React, { useState, useEffect } from 'react';
import styles from '../../styles/toolPanel.module.css'; // Make sure to import the CSS file
import { Stack, Button, IconButton } from "@mui/joy";
import { Replay } from '@mui/icons-material';
import { KeyFinding } from '../../pages/index';


type ToolProps = {
    currentSection: number;
    keyFinding: KeyFinding;
    onUpdateKeyFinding: (keyFinding: KeyFinding) => void;
};

const ToolPanel: React.FC<ToolProps> = ({ currentSection, keyFinding, onUpdateKeyFinding }) => {
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
                    <Button variant={keyFinding===KeyFinding.Shift ? "solid" : "outlined"} sx={{ minWidth: "190px", maxHeight: "40px" }} onClick={() => onUpdateKeyFinding(KeyFinding.Shift)}>
                        🚉 &nbsp;Transportaion Shift
                    </Button>
                    <Button variant={keyFinding===KeyFinding.Covid ? "solid" : "outlined"} sx={{ minWidth: "110px", maxHeight: "40px" }} onClick={() => onUpdateKeyFinding(KeyFinding.Covid)}>
                        🦠 &nbsp;COVID
                    </Button>
                    <Button variant="outlined" sx={{ minWidth: "170px", maxHeight: "40px" }}>
                        🚗 &nbsp;Cars in Germany
                    </Button>
                    <IconButton variant="outlined">
                        <Replay sx={{ transform: "rotate(-90deg)" }} />
                    </IconButton>
                </Stack>
            </div>
        </>
    );
};

export default ToolPanel;
