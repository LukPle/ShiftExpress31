import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { CssVarsProvider } from '@mui/joy/styles';
import '@fontsource/inter';
import theme from '../utils/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider theme={theme}>
        <Component {...pageProps} />
    </CssVarsProvider>
  );
}
