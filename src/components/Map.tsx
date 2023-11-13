import { Card } from "@mui/joy"

export default function Map() {
    return (
        <Card
            variant="outlined"
            sx={{
            width: 320,
            // to make the card resizable
            overflow: 'auto',
            resize: 'vertical',
            }}
        >
        </Card>
    )
}