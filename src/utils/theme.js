import { extendTheme } from '@mui/joy/styles';

//We can implement a color theme here see: https://mui.com/joy-ui/customization/theme-builder/
const theme = extendTheme({
    "colorSchemes": {
        "light": {
          "palette": {
            "primary": {
              "50": "#f0f0ff",
              "100": "#c6c6e5",
              "200": "#9c9cb4",
              "300": "#72728c",
              "400": "#484867",
              "500": "#03045e",
              "600": "#010349",
              "700": "#000238",
              "800": "#000025",
              "900": "#000012"
            },
            "background": {
              "surface": "#FFFFFF",
              "body": "#F3F3F3"
            },
            "text": {
                "primary": "#000000",
                "secondary": "#03045E",
                "tertiary": "#9BC4FD",
            }
          }
        }
      }
});

export default theme;
