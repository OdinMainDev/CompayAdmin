import { useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/Login';
import NotFound from '../pages/errors/NotFound';
import ProtectedRoute from './ProtectedRoute';
import { adminRoutes } from './adminRoutes';
import { devRoutes } from './devRoutes';
import { type RouteGroup, buildRouteObjects } from './routes';

const buildRouterConfig = (routeGroups: RouteGroup[], isAuthenticated: boolean) => {
  const panelChildren = buildRouteObjects(routeGroups);

  return [
    {
      path: '/',
      element: (
        <Navigate
          to={isAuthenticated ? '/panel/dashboard' : '/auth/login'}
          replace
        />
      ),
    },
    {
      path: '/auth/login',
      element: <LoginPage />,
    },
    {
      element: <ProtectedRoute />,
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
    { path: '*', element: <NotFound /> },
  ];
};

const AppRouter = () => {
  const { role, isAuthenticated } = useAuth();
  const routeGroups = role === 'dev' ? devRoutes : adminRoutes;

  const router = useMemo(
    () => createBrowserRouter(buildRouterConfig(routeGroups, isAuthenticated)),
    [routeGroups, isAuthenticated],
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
