import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';
import AdminGuard from '@/features/router/guards/AdminGuard';
import { faClipboardCheck, faClipboardUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const Dashboard = lazy(() => import('@/pages/dashboard/admin/Dashboard'));

const UserList = lazy(() => import('@/pages/dashboard/admin/user/List'));
const UserCreate = lazy(() => import('@/pages/dashboard/admin/user/Create'));
const UserEdit = lazy(() => import('@/pages/dashboard/admin/user/Edit'));

// LOGS
const LogAuth = lazy(() => import('@/pages/dashboard/admin/logs/Auth'));
const LogUser = lazy(() => import('@/pages/dashboard/admin/logs/User'));

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
        path: 'users',
        component: UserList,
        meta: {roles: ["admin"], showInMenu: true, label: "users", icon: faUsers },
      },
      {
        id: 'admin-users-create',
        path: 'users/create',
        component: UserCreate,
        meta: {roles: ["admin"], showInMenu: false},
      },
      {
        id: 'admin-users-update',
        path: 'users/edit/:id',
        component: UserEdit,
        meta: {roles: ["admin"], showInMenu: false},
      },


      // LOGS 
      {
        id: 'admin-logs-auth',
        path: 'logs/logs-auth',
        component: LogAuth,
        meta: {roles: ["admin"], showInMenu: true, label: "logs-auth", icon: faClipboardUser, dividerLabel: "logs", },
      },
      {
        id: 'admin-logs-user',
        path: 'logs/logs-user',
        component: LogUser,
        meta: {roles: ["admin"], showInMenu: true, label: "logs-user", icon: faClipboardCheck,},
      },
    ],
  },
];