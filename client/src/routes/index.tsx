import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Root from './Root';
import ChatRoute from './ChatRoute';
// import Search from './Search';
import {
  Login,
  Registration,
  RequestPasswordReset,
  ResetPassword,
  ApiErrorWatcher,
} from '~/components/Auth';
import { AuthContextProvider } from '~/hooks/AuthContext';

const AuthLayout = () => (
  <AuthContextProvider>
    <Outlet />
    <ApiErrorWatcher />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: 'register',
    element: <Registration />,
  },
  {
    path: 'forgot-password',
    element: <RequestPasswordReset />,
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
  // {
  //   path: '/og',
  //   element: <OgImage />,
  // },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/r/new" replace={true} />,
          },
          {
            path: 'c/:conversationId?',
            element: <ChatRoute convo="c" />,
          },
          // {
          //   path: 'search/:query?',
          //   element: <Search />,
          // },
          {
            path: 'r/:conversationId?',
            element: <ChatRoute convo="r" />,
          },
        ],
      },
    ],
  },
]);
