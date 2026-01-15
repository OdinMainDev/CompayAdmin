import { lazy } from 'react';
import type { RouteConfig } from '../types';
import { Navigate } from 'react-router-dom';
import { faChartPie, faScrewdriverWrench, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import UserEdit from '../../../pages/tools/UserEdit';

const Landing2 = lazy(() => import('../../../pages/landing/Landing'));
const Login = lazy(() => import('../../../pages/auth/Login'));
const Totp = lazy(() => import('../../../pages/auth/Totp'));
const NotFound = lazy(() => import('../../../pages/errors/NotFound'));
const Dashboard = lazy(() => import('../../../pages/dashboard/Overview'));
const FormBuilderV2 = lazy(() => import('../../../pages/tools/FormBuilderDemoV2'));
const DataTableV2 = lazy(() => import('../../../pages/tools/DatatableDemoV2'));
const UserCreate = lazy(() => import('../../../pages/tools/UserCreate'));

const DashboardLayout = lazy(() => import('../../../components/layouts/DashboardLayout'));

const AuthGuard = lazy(() => import('../guards/AuthGuard'));
const RoleGuard = lazy(() => import('../guards/RoleGuard'));
const GuestGuard = lazy(() => import('../guards/GuestGuard'));

const Landing = lazy(() => import('../../../pages/landing/LandingPage').then(module => ({
  default: module.default
})));

export const routeConfigs: RouteConfig[] = [
  // Public routes
  {
    id: "landing",
    path: "/",
    component: Landing,
  },
  {
    id: "landing-alt",
    path: "/landing",
    component: Landing2,
  },
  {
    id: "login",
    path: "/auth/login",
    guard: GuestGuard,
    component: Login,
  },
  {
    id: "totp",
    path: "/auth/totp",
    component: Totp,
  },

  // Protected panel routes
  {
    id: "panel",
    path: "/panel",
    component: DashboardLayout,
    guard: AuthGuard,
    children: [
      {
        id: "dashboard",
        path: "dashboard",
        component: Dashboard,
        meta: { label: "Dashboard", icon: faChartPie },
      },
      {
        id: "admin-forms",
        path: "admin/form-builder",
        component: FormBuilderV2,
        guard: RoleGuard,
        meta: {
          label: "Form Builder",
          roles: ["admin"],
          icon: faScrewdriverWrench,
        },
      },
      {
        id: "user-create",
        path: "user-create",
        component: UserCreate,
        guard: RoleGuard,
        meta: {
          label: "User create",
          roles: ["admin"],
          icon: faScrewdriverWrench,
        },
      },
      {
        id: "user-edit",
        path: "admin/user-edit/:id",
        component: UserEdit,
        guard: RoleGuard, 
        meta: {
          label: "User edit",
          roles: ["admin"],
          icon: faUserEdit,
          hideInMenu: true, 
        },
      },
      {
        id: "admin-datatable",
        path: "admin/datatable",
        component: DataTableV2,
        guard: RoleGuard,
        meta: {
          label: "Data Tables",
          roles: ["admin"],
          icon: faScrewdriverWrench,
        },
      },
    ],
  },

  // Redirects
  {
    id: "start-redirect",
    path: "/start",
    component: () => {
      return <Navigate to="/panel/dashboard" replace />;
    },
  },

  // 404
  {
    id: "not-found",
    path: "*",
    component: NotFound,
  },
];