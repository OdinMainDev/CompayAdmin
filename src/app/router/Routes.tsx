import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';

const Landing = lazy(() => import('@/pages/landing/Landing'));
const NotFound = lazy(() => import('@/pages/errors/NotFound'));
const Login = lazy(() => import('@/pages/dashboard/auth/Login'));
const PanelLayout = lazy(() => import('@/components/dashboard/layout/PanelLayout'));
const DashboardLayout = lazy(() => import('@/components/dashboard/layout/DashboardLayout'));

export const routeConfigs: RouteConfig[] = [
  // Landing Routes
  {
    id: 'landing',
    path: '/',
    component: Landing,
  },

  // Dashboard Routes
  {
    id: "layout-panel",
    path: "*",
    component: PanelLayout,
    children: [
      {
        id: "layout-dashboard",
        path: "dashboard",
        component: DashboardLayout,
        children: [
        //  ...
        ]
      },
      // Auth Routes
      {
        id: 'login',
        path: 'auth/login',
        component: Login,
      },
      // Error Routes
      {
        id: 'not-found',
        path: '*',
        component: NotFound,
      },
    ]
  },

  
];