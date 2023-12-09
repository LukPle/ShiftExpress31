import { ColorSchemes } from '@mui/joy/styles';

declare module '@mui/joy/styles' {
  interface Palette {
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    background: {
      surface: string;
      body: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  }

  interface ColorSchemes {
    light: {
      palette: Palette;
    };
  }
}
