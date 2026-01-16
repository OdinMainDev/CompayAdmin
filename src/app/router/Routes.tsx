import { lazy } from 'react';
import type { RouteConfig } from '@/app/router/types';
// import { Navigate } from 'react-router-dom';
// import { faChartPie, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

const Landing = lazy(() => import('@/pages/landing/Landing'));
const NotFound = lazy(() => import('@/pages/errors/NotFoundLanding'));

export const routeConfigs: RouteConfig[] = [
  // Public routes
  {
    id: 'landing',
    path: '/',
    component: Landing,
  },
//   {
//     id: 'login',
//     path: '/auth/login',
//     component: Login,
//   },
//   {
//     id: 'totp',
//     path: '/auth/totp',
//     component: Totp,
//   },
  
  // Protected panel routes
//   {
//     id: 'panel',
//     path: '/panel',
//     component: DashboardLayout,
//     guard: AuthGuard,
//     children: [
//         {
//             id: 'not-found',
//             path: '*',
//             component: NotFound,
//         },
//         {
//             id: 'dashboard',
//             path: 'dashboard',
//             component: Dashboard,
//             meta: { label: 'Dashboard', icon: faChartPie },
//         },
//         {
//             id: 'admin-forms',
//             path: 'admin/form-builder',
//             component: FormBuilderV2,
//             guard: RoleGuard,
//             meta: { label: 'Form Builder', roles: ['admin'], icon: faScrewdriverWrench },
//         },
//         {
//             id: 'user-create',
//             path: 'user-create',
//             component: UserCreate,
//             guard: RoleGuard,
//             meta: { label: 'User create', roles: ['admin', 'merchant'], icon: faScrewdriverWrench },
//         },
//         {
//             id: 'admin-datatable',
//             path: 'admin/datatable',
//             component: DataTableV2,
//             guard: RoleGuard,
//             meta: { label: 'Data Tables', roles: ['admin'], icon: faScrewdriverWrench },
//         },
//     ],
//   },

  
  // 404
  {
    id: 'not-found',
    path: '*',
    component: NotFound,
  },
];