import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';
import MerchantGuard from '@/features/router/guards/MerchantGuard';

const Dashboard = lazy(() => import('@/pages/dashboard/merchant/Dashboard'));

export const merchantRoutes: RouteConfig[] = [
  {
    id: 'merchant-layout',
    path: '',
    guard: MerchantGuard,
    children: [
      {
        id: 'merchant-dashboard',
        path: '',
        component: Dashboard,
        meta: { showInMenu: true },
      },
    ],
  },
];
