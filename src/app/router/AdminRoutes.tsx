import { lazy } from 'react';
import { RouteConfig } from '@/features/router/types';
import AdminGuard from '@/features/router/guards/AdminGuard';
import {
  faBitcoinSign,
  faBuildingColumns,
  faClipboardCheck,
  faClipboardUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = lazy(() => import('@/pages/dashboard/admin/Dashboard'));

const MerchantList = lazy(() => import('@/pages/dashboard/admin/merchant/List'));
const MerchantCreate = lazy(() => import('@/pages/dashboard/admin/merchant/Create'));
const MerchantEdit = lazy(() => import('@/pages/dashboard/admin/merchant/Edit'));

const UserList = lazy(() => import('@/pages/dashboard/admin/user/List'));
const UserCreate = lazy(() => import('@/pages/dashboard/admin/user/Create'));
const UserEdit = lazy(() => import('@/pages/dashboard/admin/user/Edit'));

const CurrencyList = lazy(() => import('@/pages/dashboard/admin/currency/List'));
const CurrencyProcess = lazy(() => import('@/pages/dashboard/admin/currency/Process'));

// LOGS
const LogAuth = lazy(() => import('@/pages/dashboard/admin/logs/Auth'));
const LogUser = lazy(() => import('@/pages/dashboard/admin/logs/User'));

export const adminRoutes: RouteConfig[] = [
  {
    id: 'admin-layout',
    path: '',
    guard: AdminGuard,
    meta: { roles: ['admin'] },
    children: [
      // Merchants
      {
        id: 'admin-merchants-list',
        path: 'merchants',
        component: MerchantList,
        meta: { roles: ['admin'], showInMenu: true, label: 'merchants', icon: faBuildingColumns },
      },
      {
        id: 'admin-merchants-create',
        path: 'merchants/create',
        component: MerchantCreate,
        meta: { roles: ['admin'], showInMenu: false },
      },
      {
        id: 'admin-merchants-update',
        path: 'merchants/edit/:id',
        component: MerchantEdit,
        meta: { roles: ['admin'], showInMenu: false },
      },

      // Users
      {
        id: 'admin-users-list',
        path: 'users',
        component: UserList,
        meta: { roles: ['admin'], showInMenu: true, label: 'users', icon: faUsers },
      },
      {
        id: 'admin-users-create',
        path: 'users/create',
        component: UserCreate,
        meta: { roles: ['admin'], showInMenu: false },
      },
      {
        id: 'admin-users-update',
        path: 'users/edit/:id',
        component: UserEdit,
        meta: { roles: ['admin'], showInMenu: false },
      },

      // Currencies
      {
        id: 'admin-currencies-list',
        path: 'currencies',
        component: CurrencyList,
        meta: { roles: ['admin'], showInMenu: true, label: 'currencies', icon: faBitcoinSign },
      },
      {
        id: 'admin-currencies-create',
        path: 'currencies/process/:id',
        component: CurrencyProcess,
        meta: { roles: ['admin'], showInMenu: false },
      },

      // LOGS
      {
        id: 'admin-logs-auth',
        path: 'logs/logs-auth',
        component: LogAuth,
        meta: {
          roles: ['admin'],
          showInMenu: true,
          label: 'logs-auth',
          icon: faClipboardUser,
          dividerLabel: 'logs',
        },
      },
      {
        id: 'admin-logs-user',
        path: 'logs/logs-user',
        component: LogUser,
        meta: { roles: ['admin'], showInMenu: true, label: 'logs-user', icon: faClipboardCheck },
      },
    ],
  },
];
