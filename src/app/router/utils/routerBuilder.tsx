import { Suspense } from 'react';
import { Preloader } from '../../../pages/landing/components/Preloader';
import type { RouteConfig } from '../types';
import type { RouteObject } from 'react-router-dom';
import React from 'react';

export const buildRouterConfig = (configs: RouteConfig[]): RouteObject[] => {
  return configs.map(config => ({
    path: config.path,
    element: buildRouteElement(config),
    children: config.children ? buildRouterConfig(config.children) : undefined,
  }));
};


const buildRouteElement = (config: RouteConfig) => {
  const { component: Component, layout: Layout, guard: Guard } = config;
  
  let element = (
    <Suspense fallback={<Preloader />}>
      <Component />
    </Suspense>
  );
  
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