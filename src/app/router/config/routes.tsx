import { lazy } from 'react';
import type { RouteConfig } from '../types';
import { Navigate } from 'react-router-dom';
import { faChartPie, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

const Landing  = lazy(() => import('../../../pages/landing/LandingPage'));
const Landing2 = lazy(() => import('../../../pages/landing/Landing'));
const Login = lazy(() => import('../../../pages/auth/Login'));
const Totp = lazy(() => import('../../../pages/auth/Totp'));
const NotFound = lazy(() => import('../../../pages/errors/NotFound'));
const Dashboard = lazy(() => import('../../../pages/dashboard/Overview'));
const FormBuilderV2 = lazy(() => import('../../../pages/tools/FormBuilderDemoV2'));
const FormBuilder = lazy(() => import('../../../pages/tools/FormBuilderDemo'));
const DataTable = lazy(() => import('../../../pages/tools/DatatableDemo'));

const DashboardLayout = lazy(() => import('../../../components/layouts/DashboardLayout'));

const AuthGuard = lazy(() => import('../guards/AuthGuard'));
const RoleGuard = lazy(() => import('../guards/RoleGuard'));

export const routeConfigs: RouteConfig[] = [
  // Public routes
  {
    id: 'landing',
    path: '/',
    component: Landing,
  },
  {
    id: 'landing-alt',
    path: '/landing',
    component: Landing2,
  },
  {
    id: 'login',
    path: '/auth/login',
    component: Login,
  },
  {
    id: 'totp',
    path: '/auth/totp',
    component: Totp,
  },
  
  // Protected panel routes
  {
    id: 'panel',
    path: '/panel',
    component: DashboardLayout,
    guard: AuthGuard,
    children: [
      {
        id: 'dashboard',
        path: 'dashboard',
        component: Dashboard,
        meta: { label: 'Dashboard', icon: faChartPie },
      },
      {
        id: 'admin-forms',
        path: 'admin/form-builder',
        component: FormBuilderV2,
        guard: RoleGuard,
        meta: { label: 'Form Builder', roles: ['admin'], icon: faScrewdriverWrench },
      },
      {
        id: 'merchant-datatable',
        path: 'merchant/datatable',
        component: DataTable,
        guard: RoleGuard,
        meta: { label: 'Data Tables', roles: ['merchant'], icon: faScrewdriverWrench },
      },
      {
        id: 'merchant-forms',
        path: 'merchant/form-builder',
        component: FormBuilder,
        guard: RoleGuard,
        meta: { label: 'Form Builder', roles: ['merchant'], icon: faScrewdriverWrench },
      },
    ],
  },
  
  // Redirects
  {
    id: 'start-redirect',
    path: '/start',
    component: () => {
      return <Navigate to="/panel/dashboard" replace />;
    },
  },
  
  // 404
  {
    id: 'not-found',
    path: '*',
    component: NotFound,
  },
];