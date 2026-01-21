import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';
import AuthGuard from '@/features/router/guards/AuthGuard';
import GuestGuard from '@/features/router/guards/GuestGuard';
import { adminRoutes } from './AdminRoutes';
import { merchantRoutes } from './MerchantRoutes';

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
        guard: AuthGuard,
        meta: {roles: ["admin", "merchant"]},
        children: [
          ...adminRoutes,
          ...merchantRoutes,
        ]
      },
      // Auth Routes
      {
        id: 'login',
        path: 'auth/login',
        component: Login,
        guard: GuestGuard,
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