import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';
import MerchantGuard from '@/features/router/guards/MerchantGuard';
import { faCog, faPercent } from '@fortawesome/free-solid-svg-icons';

const Dashboard = lazy(() => import('@/pages/dashboard/merchant/Dashboard'));
const Settings = lazy(() => import('@/pages/dashboard/merchant/Settings'));

export const merchantRoutes: RouteConfig[] = [
  {
    id: 'merchant-layout',
    path: 'merchant',
    guard: MerchantGuard,
    children: [

      // Merchants
      {
        id: 'merchant-commissions',
        path: 'commissions',
        component: Dashboard,
        meta: { roles: ['merchant'], showInMenu: true, label: 'commissions', icon: faPercent },
      },
      {
        id: 'merchant-settings',
        path: 'settings',
        component: Settings,
        meta: { roles: ['merchant'], showInMenu: true, label: 'settings', icon: faCog },
      },
    ],
  },
];
