import { ColorSchemes } from '@mui/joy/styles';

declare module '@mui/joy/styles' {
  interface PaletteBackground {
    default: string;
  }

  interface ColorSchemes {
    light: {
      palette: {
        background: PaletteBackground;
      };
    };
  }
}
