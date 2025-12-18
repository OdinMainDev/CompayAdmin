import { useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/Login';
import LandingPage from '../pages/landing/Landing';
import NotFound from '../pages/errors/NotFound';
import ProtectedRoute from './ProtectedRoute';
import { adminRoutes } from './adminRoutes';
import { merchantRoutes } from './merchantRoutes';
import { type RouteGroup, buildRouteObjects } from './routes';
import TotpPage from '../pages/auth/Totp';
import AuthMiddleware from '../middleware/AuthMiddleware';
import AuthProvider from '../auth/AuthContext';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME } from '../constants';
import { getRoleFromToken } from '../auth/authState';

const buildRouterConfig = (routeGroups: RouteGroup[]) => {
  const panelChildren = buildRouteObjects(routeGroups);

  return [
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/landing',
      element: <LandingPage />,
    },
    {
      path: '/start',
      element: (
        <Navigate
          to="/panel/dashboard"
          replace
        />
      ),
    },
    {
      path: '/auth/login',
      element: (
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      ),
    },
    {
      path: '/auth/totp',
      element: <TotpPage />,
    },
    {
      element: (
        <AuthProvider>
          <ProtectedRoute />
        </AuthProvider>
      ),
      children: [
        {
          element: <AuthMiddleware />,
          children: [
            {
              path: '/panel',
              element: <DashboardLayout routeGroups={routeGroups} />,
              children: [
                { index: true, element: <Navigate to="dashboard" replace /> },
                ...panelChildren,
                { path: '*', element: <NotFound /> },
              ],
            },
          ],
        },
      ],
    },
    { path: '*', element: <NotFound /> },
  ];
};

const AppRouter = () => {
  const token = Cookies.get(COOKIE_AUTH_NAME);
  const role = getRoleFromToken(token);
  const routeGroups = role === 'admin' ? adminRoutes : merchantRoutes;

  const router = useMemo(
    () => createBrowserRouter(buildRouterConfig(routeGroups)),
    [routeGroups],
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
