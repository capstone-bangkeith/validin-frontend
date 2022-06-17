import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

import axios from 'axios';
import type { AppProps } from 'next/app';
import { ThemeProvider, useTheme } from 'next-themes';
import { Theme, ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

declare module 'next-themes' {
  interface ThemeProviderProps {
    children: React.ReactNode;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { theme } = useTheme();
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
      <SWRConfig
        value={{
          fetcher: (url) => axios.get(url).then((res) => res.data),
        }}
      >
        <Component {...pageProps} />
        <ToastContainer theme={theme as Theme} />
      </SWRConfig>
    </ThemeProvider>
  );
};

export default MyApp;
