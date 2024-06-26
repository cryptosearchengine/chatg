import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import { RouterProvider } from 'react-router-dom';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { router } from './routes';
import { Helmet } from 'react-helmet';

const App = () => {
  const { setError } = useApiErrorBoundary();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error?.response?.status === 401) {
          setError(error);
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider>
          <RadixToast.Provider>
            <ToastProvider>
              <DndProvider backend={HTML5Backend}>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} position="top-right" />
                <Toast />
                <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
              </DndProvider>
            </ToastProvider>
          </RadixToast.Provider>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default () => (
  <ScreenshotProvider>
    <Helmet>
      <meta property="og:title" content="ChatG App" />
      <meta
        property="og:description"
        content="Free ChatGPT Alternative - Easily ask questions and receive instant answers. Utilize Google Gemini, Bing Copilot, GPT-4, GPT-3.5-turbo and Claude by Anthropic"
      />
      <meta property="og:image" content="/assets/logo.png" />
      <meta property="og:url" content="https://app.chatg.com" />
      <title>ChatG App</title>
      <meta
        name="description"
        content="Free ChatGPT Alternative - Easily ask questions and receive instant answers. Utilize Google Gemini, Bing Copilot, GPT-4, GPT-3.5-turbo and Claude by Anthropic"
      />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:type" content="website" />
      <meta name="keywords" content="ChatG, ChatGPT Alternative" />
    </Helmet>
    <App />
  </ScreenshotProvider>
);
