import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouteConfig } from './types';
import { Suspense } from 'react';
import Preloader from '@/components/base/Preloader';
import { routeConfigs } from '@/app/router/Routes';

const AppRouter = () => {
    const router = createBrowserRouter(buildRouterConfig(routeConfigs));
    return (
      <Suspense fallback={<Preloader />}>
        <RouterProvider router={router} />
      </Suspense>
    );
};

const buildRouterConfig = (configs: RouteConfig[]): RouteObject[] => {
  return configs.map(config => ({
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
        roles?: string[] 
      }>;
      
      element = (
        <GuardComponent roles={config.meta?.roles}>
          {element}
        </GuardComponent>
      );
  }
  
  return element;
};

export { AppRouter };