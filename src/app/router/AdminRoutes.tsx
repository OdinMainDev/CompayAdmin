import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';
import AdminGuard from '@/features/router/guards/AdminGuard';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const Dashboard = lazy(() => import('@/pages/dashboard/admin/Dashboard'));

export const adminRoutes: RouteConfig[] = [
  {
    id: 'admin-layout',
    path: '',
    guard: AdminGuard,
    meta: {roles: ["admin"]},
    children: [
      {
        id: 'admin-dashboard',
        path: '',
        component: Dashboard,
        meta: {roles: ["admin"], showInMenu: false},
      },
      // Users
      {
        id: 'admin-users-list',
        path: 'users/list',
        component: Dashboard,
        meta: {roles: ["admin"], showInMenu: true, label: "users_list", icon: faUsers },
      },
      {
        id: 'admin-users-create',
        path: 'users/create',
        component: Dashboard,
        meta: {roles: ["admin"], showInMenu: false},
      },
      {
        id: 'admin-users-update',
        path: 'users/edit',
        component: Dashboard,
        meta: {roles: ["admin"], showInMenu: false},
      },
    ],
  },
];