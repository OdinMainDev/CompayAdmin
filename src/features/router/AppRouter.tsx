import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouteConfig } from './types';
import { Suspense } from 'react';
import Preloader from '@/components/base/Preloader';
import { routeConfigs } from '@/app/router/Routes';
import { useAuthContext } from '../auth/auth-context';

const AppRouter = () => {
  const { getRole } = useAuthContext();
  const role = getRole();
  const router = createBrowserRouter(buildRouterConfig(resolveRoutesByRole(routeConfigs, role)));
  return (
    <Suspense fallback={<Preloader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export const resolveRoutesByRole = (
  routes: RouteConfig[],
  role: string | null
): RouteConfig[] => {

  if (!role) {
    return routes;
  }

  return routes.map((route) => {
    let resolved = route;

    if (route.variants?.[role]) {
      resolved = {
        ...route,
        ...route.variants[role],
        variants: undefined,
      };
    }

    return {
      ...resolved,
      children: resolved.children
        ? resolveRoutesByRole(resolved.children, role)
        : undefined,
    };
  });
};


const buildRouterConfig = (configs: RouteConfig[]): RouteObject[] => {

  return configs.map((config) => ({
    path: config.path,
    element: buildRouteElement(config),
    children: config.children ? buildRouterConfig(config.children) : undefined,
  }));
};

const buildRouteElement = (config: RouteConfig) => {
  const { component: Component, layout: Layout, guard: Guard } = config;

  let element: React.ReactNode;

  if (Component) {
    element = <Component />;
  } else {
    element = <Outlet />;
  }

  if (Layout) {
    const LayoutComponent = Layout;
    element = <LayoutComponent>{element}</LayoutComponent>;
  }

  if (Guard) {
    const GuardComponent = Guard as React.ComponentType<{
      children: React.ReactNode;
      roles?: string[];
    }>;

    element = <GuardComponent roles={config.meta?.roles}>{element}</GuardComponent>;
  }

  return element;
};

export { AppRouter };
